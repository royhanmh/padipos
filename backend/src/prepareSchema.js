import sequelize from "./database.js";

const normalizeTransactionOrderNumberColumn = async () => {
  const queryInterface = sequelize.getQueryInterface();

  try {
    await queryInterface.describeTable("transaction");
  } catch {
    return;
  }

  await sequelize.query(`
    ALTER TABLE "transaction"
    ALTER COLUMN "order_number" TYPE INTEGER
    USING (
      (
        COALESCE(
          NULLIF(regexp_replace("order_number"::text, '[^0-9]', '', 'g'), ''),
          '0'
        )::bigint % 2000000000
      )::integer
    );
  `);
};

export const prepareSchema = async () => {
  await normalizeTransactionOrderNumberColumn();
};

export default prepareSchema;
