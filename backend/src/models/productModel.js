import { Product } from "./index.js";
import { buildPaginatedResponse } from "../libs/pagination.js";

const toPlain = (instance) => instance.get({ plain: true });

export const listProducts = async ({ pagination } = {}) => {
  if (!pagination?.enabled) {
    const products = await Product.findAll({
      order: [["created_at", "DESC"]],
    });

    return products.map(toPlain);
  }

  const result = await Product.findAndCountAll({
    order: [["created_at", "DESC"]],
    limit: pagination.limit,
    offset: pagination.offset,
  });

  return buildPaginatedResponse({
    rows: result.rows.map(toPlain),
    count: result.count,
    page: pagination.page,
    limit: pagination.limit,
  });
};

export const getProductByUuid = async (uuid) => {
  const product = await Product.findOne({
    where: { uuid },
  });

  return product ? toPlain(product) : null;
};

export const createProduct = async (payload) => {
  const product = await Product.create({
    image: payload.image,
    title: payload.title,
    description: payload.description,
    price: payload.price,
    category: payload.category,
    quantity: payload.quantity,
  });

  return toPlain(product);
};

export const updateProductByUuid = async (uuid, payload) => {
  const product = await Product.findOne({
    where: { uuid },
  });

  if (!product) {
    return null;
  }

  Object.assign(product, payload);
  await product.save();

  return toPlain(product);
};

export const softDeleteProductByUuid = async (uuid) => {
  const product = await Product.findOne({
    where: { uuid },
  });

  if (!product) {
    return null;
  }

  await product.destroy();

  return {
    ...toPlain(product),
    deleted_at: product.deleted_at ?? new Date().toISOString(),
  };
};
