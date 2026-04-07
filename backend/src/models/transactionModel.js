import { Cashier, Product, Transaction, TransactionItem, sequelize } from "./index.js";
import { TRANSACTION_TAX_AMOUNT } from "../types/transaction.js";

const transactionInclude = [
  {
    model: Cashier,
    as: "cashier",
    attributes: ["uuid", "username"],
  },
  {
    model: TransactionItem,
    as: "items",
    attributes: [
      "uuid",
      "notes",
      "quantity",
      "subtotal_item",
      "product_title",
      "unit_price",
      "created_at",
      "updated_at",
    ],
    include: [
      {
        model: Product,
        as: "product",
        attributes: ["uuid"],
        paranoid: false,
      },
    ],
  },
];

const transactionOrder = [
  ["created_at", "DESC"],
  [{ model: TransactionItem, as: "items" }, "created_at", "ASC"],
];

const createError = (message, status) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const toTransactionResponse = (instance) => {
  const plain = instance.get({ plain: true });

  return {
    uuid: plain.uuid,
    order_number: Number(plain.order_number),
    order_type: plain.order_type,
    customer_name: plain.customer_name,
    table_number: plain.table_number,
    subtotal: plain.subtotal,
    tax: plain.tax,
    total: plain.total,
    created_at: plain.created_at,
    updated_at: plain.updated_at,
    cashier: plain.cashier
      ? {
          uuid: plain.cashier.uuid,
          username: plain.cashier.username,
        }
      : null,
    items: (plain.items ?? []).map((item) => ({
      uuid: item.uuid,
      product_uuid: item.product?.uuid ?? null,
      product_title: item.product_title,
      unit_price: item.unit_price,
      quantity: item.quantity,
      notes: item.notes,
      subtotal_item: item.subtotal_item,
      created_at: item.created_at,
      updated_at: item.updated_at,
    })),
  };
};

const findCashierInstanceByUuid = async (uuid, options = {}) => {
  return Cashier.findOne({
    where: { uuid },
    attributes: ["id", "uuid", "username"],
    ...options,
  });
};

const findTransactionInstance = async (where, options = {}) => {
  return Transaction.findOne({
    where,
    include: transactionInclude,
    order: transactionOrder,
    ...options,
  });
};

const generateOrderNumber = () => Date.now();

export const createTransaction = async ({ cashierUuid, payload }) => {
  return sequelize.transaction(async (dbTransaction) => {
    const cashier = await findCashierInstanceByUuid(cashierUuid, {
      transaction: dbTransaction,
    });

    if (!cashier) {
      throw createError("Cashier not found.", 404);
    }

    const requestedProductUuids = [
      ...new Set(payload.items.map((item) => item.product_uuid)),
    ];

    const products = await Product.findAll({
      where: { uuid: requestedProductUuids },
      attributes: ["id", "uuid", "title", "price"],
      transaction: dbTransaction,
    });

    const productMap = new Map(products.map((product) => [product.uuid, product]));
    const missingProductUuid = requestedProductUuids.find(
      (productUuid) => !productMap.has(productUuid),
    );

    if (missingProductUuid) {
      throw createError(`Product with uuid ${missingProductUuid} was not found.`, 404);
    }

    const normalizedItems = payload.items.map((item) => {
      const product = productMap.get(item.product_uuid);
      const subtotalItem = product.price * item.quantity;

      return {
        product_id: product.id,
        product_uuid: product.uuid,
        product_title: product.title,
        unit_price: product.price,
        quantity: item.quantity,
        notes: item.notes ?? null,
        subtotal_item: subtotalItem,
      };
    });

    const subtotal = normalizedItems.reduce(
      (sum, item) => sum + item.subtotal_item,
      0,
    );
    const tax = subtotal > 0 ? TRANSACTION_TAX_AMOUNT : 0;
    const total = subtotal + tax;

    const createdTransaction = await Transaction.create(
      {
        cashier_id: cashier.id,
        order_type: payload.order_type,
        customer_name: payload.customer_name,
        table_number: payload.table_number,
        subtotal,
        tax,
        total,
        order_number: generateOrderNumber(),
      },
      { transaction: dbTransaction },
    );

    await TransactionItem.bulkCreate(
      normalizedItems.map((item) => ({
        transaction_id: createdTransaction.id,
        product_id: item.product_id,
        product_title: item.product_title,
        unit_price: item.unit_price,
        notes: item.notes,
        quantity: item.quantity,
        subtotal_item: item.subtotal_item,
      })),
      { transaction: dbTransaction },
    );

    const transactionRecord = await findTransactionInstance(
      { id: createdTransaction.id },
      { transaction: dbTransaction },
    );

    return toTransactionResponse(transactionRecord);
  });
};

export const listTransactions = async ({ role, userUuid }) => {
  const where = {};

  if (role === "cashier") {
    const cashier = await findCashierInstanceByUuid(userUuid);

    if (!cashier) {
      return [];
    }

    where.cashier_id = cashier.id;
  }

  const transactions = await Transaction.findAll({
    where,
    include: transactionInclude,
    order: transactionOrder,
  });

  return transactions.map(toTransactionResponse);
};

export const getTransactionByUuid = async ({ transactionUuid, role, userUuid }) => {
  const where = { uuid: transactionUuid };

  if (role === "cashier") {
    const cashier = await findCashierInstanceByUuid(userUuid);

    if (!cashier) {
      return null;
    }

    where.cashier_id = cashier.id;
  }

  const transaction = await findTransactionInstance(where);
  return transaction ? toTransactionResponse(transaction) : null;
};
