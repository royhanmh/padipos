import dotenv from "dotenv";
import { Sequelize } from "sequelize";
import pg from "pg";

dotenv.config({ override: true, quiet: true });

const normalizeDatabaseUrl = (rawUrl) => {
  if (!rawUrl) {
    return "";
  }

  return rawUrl.trim().replace(/^['"]|['"]$/g, "");
};

const databaseUrl = normalizeDatabaseUrl(process.env.DATABASE_URL);
const sslEnabled = process.env.DB_SSL !== "false";

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required.");
}

let databaseHost = "";
try {
  databaseHost = new URL(databaseUrl).hostname;
} catch {
  throw new Error(
    "DATABASE_URL is invalid. Expected PostgreSQL connection URL.",
  );
}

if (!databaseHost) {
  throw new Error("DATABASE_URL is invalid. Hostname cannot be empty.");
}

const sequelize = new Sequelize(databaseUrl, {
  dialect: "postgres",
  dialectModule: pg,
  logging: false,
  ...(sslEnabled
    ? {
        dialectOptions: {
          ssl: {
            rejectUnauthorized:
              process.env.DB_SSL_REJECT_UNAUTHORIZED !== "false",
          },
        },
      }
    : {}),
});

export default sequelize;
export { databaseHost };
