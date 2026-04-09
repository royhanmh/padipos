import { Sequelize } from "sequelize";
import pg from "pg";

const databaseUrl = process.env.DATABASE_URL;
const sslEnabled = process.env.DB_SSL !== "false";

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required.");
}

const sequelize = new Sequelize(databaseUrl, {
  dialect: "postgres",
  dialectModule: pg,
  logging: false,
  ...(sslEnabled
    ? {
        dialectOptions: {
          ssl: {
            rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== "false",
          },
        },
      }
    : {}),
});

export default sequelize;
