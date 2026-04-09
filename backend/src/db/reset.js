import "dotenv/config";
import sequelize from "../database.js";
import { runMigrations } from "./migrate.js";
import { runSeeds } from "./seed.js";

const resetDatabase = async () => {
  await sequelize.authenticate();

  await sequelize.query('DROP SCHEMA IF EXISTS public CASCADE;');
  await sequelize.query('CREATE SCHEMA public;');
  await sequelize.query('GRANT ALL ON SCHEMA public TO public;');
  await sequelize.query('GRANT ALL ON SCHEMA public TO CURRENT_USER;');
};

try {
  await resetDatabase();
  await runMigrations({ ensureConnection: false, closeConnection: false });
  await runSeeds({ ensureConnection: false, closeConnection: false });
  await sequelize.close();
  console.log("Database reset, migrated, and seeded successfully.");
} catch (error) {
  console.error("Database reset failed:", error);
  try {
    await sequelize.close();
  } catch {}
  process.exit(1);
}
