import sequelize from "../database.js";
import initProduct from "./Product.js";

const Product = initProduct(sequelize);

export {
  sequelize,
  Product,
};
