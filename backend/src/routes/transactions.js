import express from "express";
import {
  createTransactionHandler,
  getTransactionByUuidHandler,
  listTransactionsHandler,
} from "../handlers/index.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";

const router = express.Router();

router.get("/", authenticate, listTransactionsHandler);
router.get("/:uuid", authenticate, getTransactionByUuidHandler);
router.post("/", authenticate, authorize("cashier"), createTransactionHandler);

export default router;
