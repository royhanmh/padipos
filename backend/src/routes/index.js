import express from "express";
import productRoutes from "./product.js";
import authRoutes from "./auth.js";
import transactionRoutes from "./transactions.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/transactions", transactionRoutes);

export default router;
