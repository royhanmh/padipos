import Joi from "joi";
import {
  createTransaction,
  getTransactionByUuid,
  listTransactions,
} from "../models/transactionModel.js";
import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  parsePaginationQuery,
} from "../libs/pagination.js";
import { TRANSACTION_ORDER_TYPES } from "../types/transaction.js";
import { PRODUCT_CATEGORIES } from "../types/product.js";

const transactionItemSchema = Joi.object({
  product_uuid: Joi.string()
    .guid({ version: ["uuidv4", "uuidv5", "uuidv1", "uuidv3"] })
    .required(),
  quantity: Joi.number().integer().positive().required(),
  notes: Joi.string().trim().allow("", null).max(1000),
});

const createTransactionSchema = Joi.object({
  order_type: Joi.string()
    .valid(...TRANSACTION_ORDER_TYPES)
    .required(),
  customer_name: Joi.string().trim().min(1).max(255).required(),
  table_number: Joi.when("order_type", {
    is: "dine-in",
    then: Joi.number().integer().positive().required(),
    otherwise: Joi.number().integer().positive().allow(null).optional(),
  }),
  amount_paid: Joi.number().integer().min(0).required(),
  items: Joi.array().items(transactionItemSchema).min(1).required(),
});

const listTransactionsQuerySchema = Joi.object({
  page: Joi.alternatives().try(Joi.number(), Joi.string()),
  limit: Joi.alternatives().try(Joi.number(), Joi.string()),
  start_date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/),
  finish_date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/),
  category: Joi.string().valid(...PRODUCT_CATEGORIES),
  order_type: Joi.string().valid(...TRANSACTION_ORDER_TYPES),
});

const respondKnownError = (error, res) => {
  if (!error.status) {
    return false;
  }

  res.status(error.status).json({ message: error.message });
  return true;
};

const normalizeCreatePayload = (value) => ({
  order_type: value.order_type,
  customer_name: value.customer_name.trim(),
  table_number: value.order_type === "take-away" ? null : value.table_number,
  amount_paid: value.amount_paid,
  items: value.items.map((item) => ({
    product_uuid: item.product_uuid,
    quantity: item.quantity,
    notes: item.notes?.trim() ? item.notes.trim() : null,
  })),
});

export const listTransactionsHandler = async (req, res, next) => {
  try {
    const { error, value } = listTransactionsQuerySchema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      res.status(400).json({
        message: "Transaction query is invalid.",
        errors: error.details.map((detail) => detail.message),
      });
      return;
    }

    let pagination = parsePaginationQuery(value);
    const hasFilters =
      Boolean(value.start_date) ||
      Boolean(value.finish_date) ||
      Boolean(value.category) ||
      Boolean(value.order_type);

    if (hasFilters && !pagination.enabled) {
      pagination = {
        enabled: true,
        page: DEFAULT_PAGE,
        limit: DEFAULT_LIMIT,
        offset: 0,
      };
    }

    const transactions = await listTransactions({
      role: req.user.role,
      userUuid: req.user.uuid,
      pagination,
      filters: {
        startDate: value.start_date,
        finishDate: value.finish_date,
        category: value.category,
        orderType: value.order_type,
      },
    });

    res.json(transactions);
  } catch (error) {
    next(error);
  }
};

export const getTransactionByUuidHandler = async (req, res, next) => {
  try {
    const transaction = await getTransactionByUuid({
      transactionUuid: req.params.uuid,
      role: req.user.role,
      userUuid: req.user.uuid,
    });

    if (!transaction) {
      res.status(404).json({ message: "Transaction not found." });
      return;
    }

    res.json(transaction);
  } catch (error) {
    next(error);
  }
};

export const createTransactionHandler = async (req, res, next) => {
  try {
    const { error, value } = createTransactionSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      res.status(400).json({
        message: "Transaction payload is invalid.",
        errors: error.details.map((detail) => detail.message),
      });
      return;
    }

    const transaction = await createTransaction({
      cashierUuid: req.user.uuid,
      payload: normalizeCreatePayload(value),
    });

    res.status(201).json(transaction);
  } catch (error) {
    if (respondKnownError(error, res)) {
      return;
    }

    next(error);
  }
};
