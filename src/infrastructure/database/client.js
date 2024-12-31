const knex = require("knex");
const { DATA_DIR } = require("../../startup/environment");
const { mkdirSync } = require("../../helpers/directories");

const migrationsDir = mkdirSync(__dirname + "/schema/migrations");
const seedsDir = mkdirSync(__dirname + "/schema/seeds");

/**
 * database client using knex library
 */
const client = knex({
  client: "sqlite3",
  useNullAsDefault: true,
  connection: {
    filename: `${DATA_DIR}/db.sqlite`,
    database: "app_db",
  },
  migrations: {
    directory: migrationsDir,
  },
  seeds: {
    directory: seedsDir,
  },
});

/**
 *
 * @returns transaction object
 */
const startTransaction = async () => await client.transaction();

/**
 *
 * @param {*} error
 * @param {knex.Knex.Transaction} transaction
 */
const endTransaction = async (error, transaction) => {
  if (error) {
    return await transaction.rollback();
  }
  return await transaction.commit();
};

module.exports = {
  client,
  seedsDir,
  migrationsDir,
  startTransaction,
  endTransaction,
};
