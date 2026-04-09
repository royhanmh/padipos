import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const DB_ROOT = fileURLToPath(new URL(".", import.meta.url));
export const MIGRATIONS_DIR = path.join(DB_ROOT, "migrations");
export const SEEDERS_DIR = path.join(DB_ROOT, "seeders");
export const MIGRATION_META_TABLE = "db_migration_meta";
export const SEED_META_TABLE = "db_seed_meta";

const quoteIdentifier = (value) => `"${value.replace(/"/g, "\"\"")}"`;

export const ensureTrackingTable = async (sequelize, tableName) => {
  await sequelize.query(`
    CREATE TABLE IF NOT EXISTS ${quoteIdentifier(tableName)} (
      "name" VARCHAR(255) PRIMARY KEY,
      "applied_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
};

export const listAppliedEntries = async (sequelize, tableName) => {
  const [rows] = await sequelize.query(`
    SELECT "name", "applied_at"
    FROM ${quoteIdentifier(tableName)}
    ORDER BY "applied_at" ASC, "name" ASC;
  `);

  return rows;
};

export const markEntryApplied = async (sequelize, tableName, name) => {
  await sequelize.query(
    `
      INSERT INTO ${quoteIdentifier(tableName)} ("name", "applied_at")
      VALUES (:name, NOW())
      ON CONFLICT ("name") DO NOTHING;
    `,
    {
      replacements: { name },
    },
  );
};

export const unmarkEntryApplied = async (sequelize, tableName, name) => {
  await sequelize.query(
    `
      DELETE FROM ${quoteIdentifier(tableName)}
      WHERE "name" = :name;
    `,
    {
      replacements: { name },
    },
  );
};

export const loadModuleDefinitions = async (directory) => {
  const entries = await fs.readdir(directory, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".js"))
    .map((entry) => ({
      name: entry.name,
      fullPath: path.join(directory, entry.name),
    }))
    .sort((first, second) => first.name.localeCompare(second.name));
};

export const importModule = async (fullPath) => {
  const moduleUrl = pathToFileURL(fullPath);
  moduleUrl.searchParams.set("ts", String(Date.now()));
  const imported = await import(moduleUrl.href);

  if (!imported.default) {
    throw new Error(`Module ${path.basename(fullPath)} must export a default object.`);
  }

  return imported.default;
};
