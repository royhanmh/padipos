import sequelize from "../database.js";
import initProduct from "./Product.js";
import initAdmin from "./Admin.js";
import initCashier from "./Cashier.js";

const Product = initProduct(sequelize);
const Admin = initAdmin(sequelize);
const Cashier = initCashier(sequelize);

export {
  sequelize,
  Product,
  Admin,
  Cashier,
};
