import express from "express";
import {
  createProductHandler,
  deleteProductHandler,
  getProductByUuidHandler,
  listProductsHandler,
  updateProductHandler,
} from "../handlers/index.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";

const router = express.Router();

// Public routes (no auth required)
router.get("/", listProductsHandler);
router.get("/:uuid", getProductByUuidHandler);

// Protected routes (admin only)
router.post("/", authenticate, authorize("admin"), createProductHandler);
router.patch("/:uuid", authenticate, authorize("admin"), updateProductHandler);
router.delete("/:uuid", authenticate, authorize("admin"), deleteProductHandler);

export default router;
