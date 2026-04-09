import express from "express";
import {
  loginAdminHandler,
  registerAdminHandler,
  loginCashierHandler,
  registerCashierHandler,
  requestCashierPasswordResetHandler,
  resetCashierPasswordHandler,
  getMeHandler,
  updateMeHandler,
  updateMePasswordHandler,
} from "../handlers/index.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = express.Router();

// Admin auth
router.post("/admin/login", loginAdminHandler);
router.post("/admin/register", registerAdminHandler);

// Cashier auth
router.post("/cashier/login", loginCashierHandler);
router.post("/cashier/register", registerCashierHandler);
router.post("/cashier/request-reset-password", requestCashierPasswordResetHandler);
router.post("/cashier/reset-password", resetCashierPasswordHandler);

// Current user profile (requires token)
router.get("/me", authenticate, getMeHandler);
router.patch("/me", authenticate, updateMeHandler);
router.patch("/me/password", authenticate, updateMePasswordHandler);

export default router;
