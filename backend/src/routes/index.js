import express from "express";
import productRoutes from "./product.js";
import authRoutes from "./auth.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/products", productRoutes);

export default router;
