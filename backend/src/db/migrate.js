import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Sequelize } from "sequelize";
import sequelize from "../database.js";
import {
  ensureTrackingTable,
  importModule,
  listAppliedEntries,
  loadModuleDefinitions,
  markEntryApplied,
  MIGRATIONS_DIR,
  MIGRATION_META_TABLE,
  unmarkEntryApplied,
} from "./runtime.js";

const getMigrationMap = async () => {
  const migrations = await loadModuleDefinitions(MIGRATIONS_DIR);
  return new Map(migrations.map((migration) => [migration.name, migration]));
};

export const runMigrations = async ({
  action = "up",
  ensureConnection = true,
  closeConnection = true,
} = {}) => {
  if (ensureConnection) {
    await sequelize.authenticate();
  }

  try {
    await ensureTrackingTable(sequelize, MIGRATION_META_TABLE);

    const queryInterface = sequelize.getQueryInterface();
    const appliedEntries = await listAppliedEntries(sequelize, MIGRATION_META_TABLE);
    const appliedNames = new Set(appliedEntries.map((entry) => entry.name));
    const migrationMap = await getMigrationMap();
    const migrations = [...migrationMap.values()];

    if (action === "undo") {
      const latestApplied = appliedEntries.at(-1);

      if (!latestApplied) {
        console.log("No migrations to undo.");
        return;
      }

      const migrationInfo = migrationMap.get(latestApplied.name);
      if (!migrationInfo) {
        throw new Error(
          `Applied migration ${latestApplied.name} does not exist in ${MIGRATIONS_DIR}.`,
        );
      }

      const migration = await importModule(migrationInfo.fullPath);
      if (typeof migration.down !== "function") {
        throw new Error(`Migration ${latestApplied.name} is missing a down() function.`);
      }

      await migration.down(queryInterface, Sequelize);
      await unmarkEntryApplied(sequelize, MIGRATION_META_TABLE, latestApplied.name);
      console.log(`Undid migration ${latestApplied.name}.`);
      return;
    }

    const pendingMigrations = migrations.filter(
      (migration) => !appliedNames.has(migration.name),
    );

    if (pendingMigrations.length === 0) {
      console.log("No pending migrations.");
      return;
    }

    for (const migrationInfo of pendingMigrations) {
      const migration = await importModule(migrationInfo.fullPath);
      if (typeof migration.up !== "function") {
        throw new Error(`Migration ${migrationInfo.name} is missing an up() function.`);
      }

      await migration.up(queryInterface, Sequelize);
      await markEntryApplied(sequelize, MIGRATION_META_TABLE, migrationInfo.name);
      console.log(`Applied migration ${migrationInfo.name}.`);
    }
  } finally {
    if (closeConnection) {
      await sequelize.close();
    }
  }
};

const isDirectRun =
  process.argv[1] &&
  fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);

if (isDirectRun) {
  const action = process.argv[2] === "undo" ? "undo" : "up";

  runMigrations({ action }).catch((error) => {
    console.error("Migration runner failed:", error);
    process.exit(1);
  });
}
