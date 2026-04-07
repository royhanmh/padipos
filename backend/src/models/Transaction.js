import { DataTypes } from "sequelize";

export default (sequelize) =>
  sequelize.define(
    "Transaction",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        defaultValue: DataTypes.UUIDV4,
      },
      cashier_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      order_type: {
        type: DataTypes.ENUM("dine-in", "take-away"),
        allowNull: false,
      },
      customer_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      table_number: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      subtotal: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      tax: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      total: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      amount_paid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      order_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "transaction",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    },
  );

