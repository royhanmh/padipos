import sequelize from "../database.js";
import initProduct from "./Product.js";
import initAdmin from "./Admin.js";
import initCashier from "./Cashier.js";
import initTransaction from "./Transaction.js";
import initTransactionItem from "./TransactionItem.js";

const Product = initProduct(sequelize);
const Admin = initAdmin(sequelize);
const Cashier = initCashier(sequelize);
const Transaction = initTransaction(sequelize);
const TransactionItem = initTransactionItem(sequelize);

Cashier.hasMany(Transaction, {
  foreignKey: "cashier_id",
  as: "transactions",
});
Transaction.belongsTo(Cashier, {
  foreignKey: "cashier_id",
  as: "cashier",
});

Transaction.hasMany(TransactionItem, {
  foreignKey: "transaction_id",
  as: "items",
});
TransactionItem.belongsTo(Transaction, {
  foreignKey: "transaction_id",
  as: "transaction",
});

Product.hasMany(TransactionItem, {
  foreignKey: "product_id",
  as: "transaction_items",
});
TransactionItem.belongsTo(Product, {
  foreignKey: "product_id",
  as: "product",
});

export {
  sequelize,
  Product,
  Admin,
  Cashier,
  Transaction,
  TransactionItem,
};
