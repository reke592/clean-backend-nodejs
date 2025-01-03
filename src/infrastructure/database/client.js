const knex = require("knex");
const { config, DATA_DIR } = require("../../startup/environment");
const { mkdirSync } = require("../../helpers/directories");

const migrationsDir = mkdirSync(__dirname + "/schema/migrations");
const seedsDir = mkdirSync(__dirname + "/schema/seeds");

/**
 * database client using knex library
 */
const client = knex({
  client: config.get("database.client"),
  useNullAsDefault: config.get("database.client") === "sqlite3",
  connection: {
    filename: `${DATA_DIR}/${config.get("database.name")}.sqlite`,
    database: config.get("database.name"),
    host: config.get("database.host"),
    port: config.get("database.port"),
    user: config.get("database.username"),
    password: config.get("database.password"),
    pool: {
      min: config.get("database.pool.min"),
      max: config.get("database.pool.max"),
    },
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
