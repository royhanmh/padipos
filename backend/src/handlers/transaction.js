import Joi from "joi";
import {
  createTransaction,
  getTransactionByUuid,
  listTransactions,
} from "../models/transactionModel.js";
import { TRANSACTION_ORDER_TYPES } from "../types/transaction.js";

const transactionItemSchema = Joi.object({
  product_uuid: Joi.string().guid({ version: ["uuidv4", "uuidv5", "uuidv1", "uuidv3"] }).required(),
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
  items: Joi.array().items(transactionItemSchema).min(1).required(),
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
  items: value.items.map((item) => ({
    product_uuid: item.product_uuid,
    quantity: item.quantity,
    notes: item.notes?.trim() ? item.notes.trim() : null,
  })),
});

export const listTransactionsHandler = async (req, res, next) => {
  try {
    const transactions = await listTransactions({
      role: req.user.role,
      userUuid: req.user.uuid,
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
