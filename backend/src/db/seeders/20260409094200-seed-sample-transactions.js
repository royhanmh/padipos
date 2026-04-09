import { randomUUID } from "node:crypto";
import { QueryTypes } from "sequelize";

const TAX_AMOUNT = 5000;
const SEEDED_CASHIER_EMAIL = "kasir@possederhana.com";
const ORDER_NUMBER_START = 910000;
const ORDER_NUMBER_END = 910099;

const FOOD_TITLES = [
  "Nasi Goreng Kampung",
  "Mie Goreng Jawa",
  "Soto Ayam Lamongan",
  "Ayam Geprek Sambal Matah",
  "Sate Ayam Madura",
  "Rendang Daging Padang",
  "Nasi Uduk Betawi",
  "Bakmi Goreng Seafood",
];

const BEVERAGE_TITLES = [
  "Es Teh Manis",
  "Es Jeruk Peras",
  "Kopi Susu Aren",
  "Wedang Jahe",
  "Es Cendol",
  "Jus Alpukat Cokelat",
];

const DESSERT_TITLES = [
  "Pisang Goreng Madu",
  "Klepon Pandan",
  "Es Campur Nusantara",
  "Puding Gula Aren",
  "Martabak Mini Cokelat Keju",
  "Dadar Gulung Kelapa",
];

const CUSTOMER_NAMES = [
  "Budi Santoso",
  "Siti Aisyah",
  "Andi Pratama",
  "Rina Wulandari",
  "Dewi Lestari",
  "Fajar Nugroho",
  "Nadia Putri",
  "Yusuf Hidayat",
  "Rizky Ramadhan",
  "Maya Permata",
  "Bagas Saputra",
  "Intan Maharani",
];

const ITEM_NOTES = [
  null,
  "Pedas sedang",
  "Tanpa es",
  "Sedikit gula",
  "Tanpa bawang",
  "Tambah sambal",
  "Tanpa kuah terpisah",
];

const getDateAtOffset = (dayOffset, hour, minute) => {
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  date.setDate(date.getDate() - dayOffset);
  return date;
};

const getAmountPaid = (total, index) => {
  const extraAmounts = [0, 2000, 5000, 10000, 15000];
  return total + extraAmounts[index % extraAmounts.length];
};

const getFromList = (items, index) => items[index % items.length];

const buildItem = (product, quantity, note = null) => ({
  product_id: product.id,
  product_title: product.title,
  product_category: product.category,
  unit_price: Number(product.price),
  quantity,
  notes: note,
  subtotal_item: Number(product.price) * quantity,
});

const selectItemsForPrimaryOrder = (dayOffset, productsByTitle) => {
  const foodA = productsByTitle.get(getFromList(FOOD_TITLES, dayOffset));
  const beverageA = productsByTitle.get(getFromList(BEVERAGE_TITLES, dayOffset));
  const beverageB = productsByTitle.get(
    getFromList(BEVERAGE_TITLES, dayOffset + 2),
  );
  const dessertA = productsByTitle.get(getFromList(DESSERT_TITLES, dayOffset));
  const dessertB = productsByTitle.get(
    getFromList(DESSERT_TITLES, dayOffset + 3),
  );

  if (dayOffset % 5 === 0) {
    return [
      buildItem(beverageA, 2, ITEM_NOTES[(dayOffset + 1) % ITEM_NOTES.length]),
      ...(dayOffset % 10 === 0
        ? [
            buildItem(
              beverageB,
              1,
              ITEM_NOTES[(dayOffset + 2) % ITEM_NOTES.length],
            ),
          ]
        : []),
    ];
  }

  if (dayOffset % 7 === 0) {
    return [
      buildItem(dessertA, 1, ITEM_NOTES[(dayOffset + 3) % ITEM_NOTES.length]),
      ...(dayOffset % 14 === 0
        ? [
            buildItem(
              dessertB,
              1,
              ITEM_NOTES[(dayOffset + 4) % ITEM_NOTES.length],
            ),
          ]
        : []),
    ];
  }

  if (dayOffset % 3 === 0) {
    return [
      buildItem(
        foodA,
        (dayOffset % 2) + 1,
        ITEM_NOTES[dayOffset % ITEM_NOTES.length],
      ),
      buildItem(beverageA, 1, ITEM_NOTES[(dayOffset + 1) % ITEM_NOTES.length]),
      buildItem(dessertA, 1, ITEM_NOTES[(dayOffset + 2) % ITEM_NOTES.length]),
    ];
  }

  return [
    buildItem(
      foodA,
      (dayOffset % 2) + 1,
      ITEM_NOTES[dayOffset % ITEM_NOTES.length],
    ),
    buildItem(beverageA, 1, ITEM_NOTES[(dayOffset + 1) % ITEM_NOTES.length]),
  ];
};

const selectItemsForSecondaryOrder = (dayOffset, productsByTitle) => {
  const foodA = productsByTitle.get(getFromList(FOOD_TITLES, dayOffset + 1));
  const foodB = productsByTitle.get(getFromList(FOOD_TITLES, dayOffset + 4));
  const dessertA = productsByTitle.get(getFromList(DESSERT_TITLES, dayOffset + 2));

  if (dayOffset % 4 === 0) {
    return [
      buildItem(foodA, 1, ITEM_NOTES[(dayOffset + 2) % ITEM_NOTES.length]),
      buildItem(foodB, 1, ITEM_NOTES[(dayOffset + 5) % ITEM_NOTES.length]),
    ];
  }

  return [
    buildItem(foodA, 1, ITEM_NOTES[(dayOffset + 2) % ITEM_NOTES.length]),
    buildItem(dessertA, 1, ITEM_NOTES[(dayOffset + 5) % ITEM_NOTES.length]),
  ];
};

export default {
  async up(queryInterface) {
    const cashiers = await queryInterface.sequelize.query(
      'SELECT "id" FROM "cashier" WHERE "email" = :email LIMIT 1;',
      {
        replacements: { email: SEEDED_CASHIER_EMAIL },
        type: QueryTypes.SELECT,
      },
    );

    if (cashiers.length === 0) {
      throw new Error(
        `Cashier with email ${SEEDED_CASHIER_EMAIL} must exist before seeding transactions.`,
      );
    }

    const productRows = await queryInterface.sequelize.query(
      'SELECT "id", "title", "category", "price" FROM "product" WHERE "deleted_at" IS NULL;',
      {
        type: QueryTypes.SELECT,
      },
    );

    const productsByTitle = new Map(
      productRows.map((product) => [product.title, product]),
    );

    const missingTitles = [
      ...FOOD_TITLES,
      ...BEVERAGE_TITLES,
      ...DESSERT_TITLES,
    ].filter((title) => !productsByTitle.has(title));

    if (missingTitles.length > 0) {
      throw new Error(
        `Missing seeded products for sample transactions: ${missingTitles.join(", ")}`,
      );
    }

    const soldByProductId = new Map();
    const transactionItems = [];
    let orderNumber = ORDER_NUMBER_START;
    let transactionIndex = 0;
    const cashierId = cashiers[0].id;

    const insertTransaction = async ({
      createdAt,
      orderType,
      customerName,
      tableNumber,
      items,
    }) => {
      const subtotal = items.reduce((sum, item) => sum + item.subtotal_item, 0);
      const tax = subtotal > 0 ? TAX_AMOUNT : 0;
      const total = subtotal + tax;
      const amountPaid = getAmountPaid(total, transactionIndex);
      const updatedAt = new Date(createdAt);

      const [rows] = await queryInterface.sequelize.query(
        `
          INSERT INTO "transaction" (
            "uuid",
            "cashier_id",
            "order_type",
            "customer_name",
            "table_number",
            "subtotal",
            "tax",
            "total",
            "amount_paid",
            "order_number",
            "created_at",
            "updated_at",
            "deleted_at"
          )
          VALUES (
            :uuid,
            :cashierId,
            :orderType,
            :customerName,
            :tableNumber,
            :subtotal,
            :tax,
            :total,
            :amountPaid,
            :orderNumber,
            :createdAt,
            :updatedAt,
            NULL
          )
          RETURNING "id";
        `,
        {
          replacements: {
            uuid: randomUUID(),
            cashierId,
            orderType,
            customerName,
            tableNumber,
            subtotal,
            tax,
            total,
            amountPaid,
            orderNumber,
            createdAt,
            updatedAt,
          },
        },
      );

      const transactionId = rows[0].id;

      items.forEach((item, itemIndex) => {
        const itemCreatedAt = new Date(createdAt);
        itemCreatedAt.setMinutes(itemCreatedAt.getMinutes() + itemIndex);

        transactionItems.push({
          uuid: randomUUID(),
          transaction_id: transactionId,
          product_id: item.product_id,
          product_title: item.product_title,
          product_category: item.product_category,
          unit_price: item.unit_price,
          notes: item.notes,
          quantity: item.quantity,
          subtotal_item: item.subtotal_item,
          created_at: itemCreatedAt,
          updated_at: itemCreatedAt,
          deleted_at: null,
        });

        soldByProductId.set(
          item.product_id,
          (soldByProductId.get(item.product_id) || 0) + item.quantity,
        );
      });

      orderNumber += 1;
      transactionIndex += 1;
    };

    for (let dayOffset = 29; dayOffset >= 0; dayOffset -= 1) {
      const primaryOrderType = dayOffset % 2 === 0 ? "dine-in" : "take-away";
      const primaryTableNumber =
        primaryOrderType === "dine-in" ? (dayOffset % 12) + 1 : null;

      await insertTransaction({
        createdAt: getDateAtOffset(dayOffset, 10 + (dayOffset % 4), 15),
        orderType: primaryOrderType,
        customerName: getFromList(CUSTOMER_NAMES, dayOffset),
        tableNumber: primaryTableNumber,
        items: selectItemsForPrimaryOrder(dayOffset, productsByTitle),
      });

      if (dayOffset % 2 === 0) {
        const secondaryOrderType = dayOffset % 3 === 0 ? "take-away" : "dine-in";
        const secondaryTableNumber =
          secondaryOrderType === "dine-in" ? ((dayOffset + 5) % 12) + 1 : null;

        await insertTransaction({
          createdAt: getDateAtOffset(dayOffset, 17 + (dayOffset % 3), 40),
          orderType: secondaryOrderType,
          customerName: getFromList(CUSTOMER_NAMES, dayOffset + 5),
          tableNumber: secondaryTableNumber,
          items: selectItemsForSecondaryOrder(dayOffset, productsByTitle),
        });
      }
    }

    await queryInterface.bulkInsert("transaction_item", transactionItems);

    const updateTimestamp = new Date();
    for (const [productId, soldQuantity] of soldByProductId.entries()) {
      await queryInterface.sequelize.query(
        `
          UPDATE "product"
          SET
            "quantity" = GREATEST("quantity" - :soldQuantity, 0),
            "updated_at" = :updatedAt
          WHERE "id" = :productId;
        `,
        {
          replacements: {
            productId,
            soldQuantity,
            updatedAt: updateTimestamp,
          },
        },
      );
    }
  },

  async down(queryInterface, Sequelize) {
    const soldRows = await queryInterface.sequelize.query(
      `
        SELECT
          ti."product_id" AS "productId",
          SUM(ti."quantity")::integer AS "soldQuantity"
        FROM "transaction_item" ti
        INNER JOIN "transaction" t ON t."id" = ti."transaction_id"
        WHERE t."order_number" BETWEEN :start AND :end
        GROUP BY ti."product_id";
      `,
      {
        replacements: {
          start: ORDER_NUMBER_START,
          end: ORDER_NUMBER_END,
        },
        type: QueryTypes.SELECT,
      },
    );

    const updateTimestamp = new Date();
    for (const row of soldRows) {
      await queryInterface.sequelize.query(
        `
          UPDATE "product"
          SET
            "quantity" = "quantity" + :soldQuantity,
            "updated_at" = :updatedAt
          WHERE "id" = :productId;
        `,
        {
          replacements: {
            productId: row.productId,
            soldQuantity: row.soldQuantity,
            updatedAt: updateTimestamp,
          },
        },
      );
    }

    await queryInterface.bulkDelete("transaction", {
      order_number: {
        [Sequelize.Op.between]: [ORDER_NUMBER_START, ORDER_NUMBER_END],
      },
    });
  },
};
