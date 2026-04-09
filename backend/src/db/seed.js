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
  SEEDERS_DIR,
  SEED_META_TABLE,
  unmarkEntryApplied,
} from "./runtime.js";

const getSeederMap = async () => {
  const seeders = await loadModuleDefinitions(SEEDERS_DIR);
  return new Map(seeders.map((seeder) => [seeder.name, seeder]));
};

export const runSeeds = async ({
  action = "up",
  ensureConnection = true,
  closeConnection = true,
} = {}) => {
  if (ensureConnection) {
    await sequelize.authenticate();
  }

  try {
    await ensureTrackingTable(sequelize, SEED_META_TABLE);

    const queryInterface = sequelize.getQueryInterface();
    const appliedEntries = await listAppliedEntries(sequelize, SEED_META_TABLE);
    const appliedNames = new Set(appliedEntries.map((entry) => entry.name));
    const seederMap = await getSeederMap();
    const seeders = [...seederMap.values()];

    if (action === "undo:all") {
      const appliedSeeders = [...appliedEntries].reverse();

      if (appliedSeeders.length === 0) {
        console.log("No seeders to undo.");
        return;
      }

      for (const appliedSeeder of appliedSeeders) {
        const seederInfo = seederMap.get(appliedSeeder.name);
        if (!seederInfo) {
          throw new Error(
            `Applied seeder ${appliedSeeder.name} does not exist in ${SEEDERS_DIR}.`,
          );
        }

        const seeder = await importModule(seederInfo.fullPath);
        if (typeof seeder.down !== "function") {
          throw new Error(`Seeder ${appliedSeeder.name} is missing a down() function.`);
        }

        await seeder.down(queryInterface, Sequelize);
        await unmarkEntryApplied(sequelize, SEED_META_TABLE, appliedSeeder.name);
        console.log(`Undid seeder ${appliedSeeder.name}.`);
      }

      return;
    }

    const pendingSeeders = seeders.filter((seeder) => !appliedNames.has(seeder.name));

    if (pendingSeeders.length === 0) {
      console.log("No pending seeders.");
      return;
    }

    for (const seederInfo of pendingSeeders) {
      const seeder = await importModule(seederInfo.fullPath);
      if (typeof seeder.up !== "function") {
        throw new Error(`Seeder ${seederInfo.name} is missing an up() function.`);
      }

      await seeder.up(queryInterface, Sequelize);
      await markEntryApplied(sequelize, SEED_META_TABLE, seederInfo.name);
      console.log(`Applied seeder ${seederInfo.name}.`);
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
  const action = process.argv[2] === "undo:all" ? "undo:all" : "up";

  runSeeds({ action }).catch((error) => {
    console.error("Seed runner failed:", error);
    process.exit(1);
  });
}
