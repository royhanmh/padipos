import express from "express";
import productRoutes from "./product.js";

const router = express.Router();

router.use("/products", productRoutes);

export default router;
