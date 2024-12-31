exports.config = { transaction: false };

/**
 * @param {import("knex").Knex} knex
 */
exports.up = function (knex) {
  // deployment process
  return Promise.all([
    knex.schema.createTable("users", (table) => {
      table.increments("id").primary();
      table.string("email").notNullable().unique();
      table.string("password").notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
    }),
  ]);
};

/**
 * @param {import("knex").Knex} knex
 */
exports.down = function (knex) {
  // rollback process
  return Promise.all([knex.schema.dropTable("users")]);
};
