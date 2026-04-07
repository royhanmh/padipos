import express from "express";
import {
  loginAdminHandler,
  registerAdminHandler,
  loginCashierHandler,
  registerCashierHandler,
  getMeHandler,
} from "../handlers/index.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = express.Router();

// Admin auth
router.post("/admin/login", loginAdminHandler);
router.post("/admin/register", registerAdminHandler);

// Cashier auth
router.post("/cashier/login", loginCashierHandler);
router.post("/cashier/register", registerCashierHandler);

// Current user profile (requires token)
router.get("/me", authenticate, getMeHandler);

export default router;
