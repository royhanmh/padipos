import Joi from "joi";
import {
  createProduct,
  getProductByUuid,
  listProducts,
  softDeleteProductByUuid,
  updateProductByUuid,
} from "../models/productModel.js";
import { PRODUCT_CATEGORIES } from "../types/product.js";

const createProductSchema = Joi.object({
  image: Joi.string().trim().min(1).required(),
  title: Joi.string().trim().min(1).required(),
  description: Joi.string().trim().min(1).required(),
  price: Joi.number().integer().min(0).required(),
  category: Joi.string()
    .trim()
    .valid(...PRODUCT_CATEGORIES)
    .required(),
  quantity: Joi.number().integer().min(0).required(),
});

const updateProductSchema = Joi.object({
  image: Joi.string().trim().min(1),
  title: Joi.string().trim().min(1),
  description: Joi.string().trim().min(1),
  price: Joi.number().integer().min(0),
  category: Joi.string()
    .trim()
    .valid(...PRODUCT_CATEGORIES),
  quantity: Joi.number().integer().min(0),
}).min(1);

export const listProductsHandler = async (_req, res, next) => {
  try {
    const products = await listProducts();
    res.json(products);
  } catch (error) {
    next(error);
  }
};

export const getProductByUuidHandler = async (req, res, next) => {
  try {
    const product = await getProductByUuid(req.params.uuid);

    if (!product) {
      res.status(404).json({ message: "Product not found." });
      return;
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
};

export const createProductHandler = async (req, res, next) => {
  try {
    const { error, value } = createProductSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      res.status(400).json({
        message: "Product payload is invalid.",
        errors: error.details.map((d) => d.message),
      });
      return;
    }

    const product = await createProduct(value);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

export const updateProductHandler = async (req, res, next) => {
  try {
    const { error, value } = updateProductSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      res.status(400).json({
        message: "Product payload is invalid.",
        errors: error.details.map((d) => d.message),
      });
      return;
    }

    const product = await updateProductByUuid(req.params.uuid, value);

    if (!product) {
      res.status(404).json({ message: "Product not found." });
      return;
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
};

export const deleteProductHandler = async (req, res, next) => {
  try {
    const product = await softDeleteProductByUuid(req.params.uuid);

    if (!product) {
      res.status(404).json({ message: "Product not found." });
      return;
    }

    res.json({
      message: "Product deleted successfully.",
      product,
    });
  } catch (error) {
    next(error);
  }
};
