import { randomUUID } from "node:crypto";
import { db } from "../database.js";

const cloneProduct = (product) => ({ ...product });

const findActiveProductIndex = (uuid) =>
  db.products.findIndex(
    (product) => product.uuid === uuid && product.deleted_at === null,
  );

export const listProducts = () =>
  db.products
    .filter((product) => product.deleted_at === null)
    .map(cloneProduct);

export const getProductByUuid = (uuid) => {
  const product = db.products.find(
    (item) => item.uuid === uuid && item.deleted_at === null,
  );

  return product ? cloneProduct(product) : null;
};

export const createProduct = (payload) => {
  const timestamp = new Date().toISOString();
  const product = {
    id: db.getNextProductId(),
    uuid: randomUUID(),
    image: payload.image,
    title: payload.title,
    description: payload.description,
    price: payload.price,
    category: payload.category,
    quantity: payload.quantity,
    created_at: timestamp,
    updated_at: timestamp,
    deleted_at: null,
  };

  db.products.unshift(product);
  return cloneProduct(product);
};

export const updateProductByUuid = (uuid, payload) => {
  const index = findActiveProductIndex(uuid);

  if (index === -1) {
    return null;
  }

  const currentProduct = db.products[index];
  const nextProduct = {
    ...currentProduct,
    ...payload,
    updated_at: new Date().toISOString(),
  };

  db.products[index] = nextProduct;
  return cloneProduct(nextProduct);
};

export const softDeleteProductByUuid = (uuid) => {
  const index = findActiveProductIndex(uuid);

  if (index === -1) {
    return null;
  }

  const timestamp = new Date().toISOString();
  const nextProduct = {
    ...db.products[index],
    updated_at: timestamp,
    deleted_at: timestamp,
  };

  db.products[index] = nextProduct;
  return cloneProduct(nextProduct);
};
