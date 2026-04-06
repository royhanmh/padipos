import {
  createProduct,
  getProductByUuid,
  softDeleteProductByUuid,
  updateProductByUuid,
} from "../models/index.js";
import { listProducts } from "../models/productModel.js";

export const listProductsHandler = (_req, res) => {
  res.json(listProducts());
};

export const getProductByUuidHandler = (req, res) => {
  const product = getProductByUuid(req.params.uuid);

  if (!product) {
    res.status(404).json({ message: "Product not found." });
    return;
  }

  res.json(product);
};

export const createProductHandler = (req, res) => {
  const product = createProduct(req.validatedProductPayload);
  res.status(201).json(product);
};

export const updateProductHandler = (req, res) => {
  const product = updateProductByUuid(
    req.params.uuid,
    req.validatedProductPayload,
  );

  if (!product) {
    res.status(404).json({ message: "Product not found." });
    return;
  }

  res.json(product);
};

export const deleteProductHandler = (req, res) => {
  const product = softDeleteProductByUuid(req.params.uuid);

  if (!product) {
    res.status(404).json({ message: "Product not found." });
    return;
  }

  res.json({
    message: "Product deleted successfully.",
    product,
  });
};
