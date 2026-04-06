import express from "express";
import {
  createProductHandler,
  deleteProductHandler,
  getProductByUuidHandler,
  listProductsHandler,
  updateProductHandler,
} from "../handlers/index.js";

const router = express.Router();

router.get("/", listProductsHandler);
router.get("/:uuid", getProductByUuidHandler);
router.post("/", createProductHandler);
router.patch("/:uuid", updateProductHandler);
router.delete("/:uuid", deleteProductHandler);

export default router;
