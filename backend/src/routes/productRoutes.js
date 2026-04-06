import express from "express";
import {
  createProductHandler,
  deleteProductHandler,
  getProductByUuidHandler,
  listProductsHandler,
  updateProductHandler,
} from "../handlers/index.js";
import { validateProductPayload } from "../middlewares/validateProductPayload.js";

const router = express.Router();

router.get("/", listProductsHandler);
router.get("/:uuid", getProductByUuidHandler);
router.post("/", validateProductPayload("create"), createProductHandler);
router.patch("/:uuid", validateProductPayload("update"), updateProductHandler);
router.delete("/:uuid", deleteProductHandler);

export default router;
