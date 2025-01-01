const fs = require("fs");
const { Command } = require("commander");
const { client, migrationsDir, seedsDir } = require("./client");

/**
 * command line interface parser
 */
const program = new Command();

/**
 * initial content for migration file
 */
const migrationTemplate = `
exports.config = { transaction: false };

/**
 * @param {import("knex").Knex} knex
 */
exports.up = function (knex) {
  // deployment process
  return Promise.all([
    
  ]);
};

/**
 * @param {import("knex").Knex} knex
 */
exports.down = function (knex) {
  // rollback process
  return Promise.all([
    
  ]);
};
`.trim();

/**
 * initial content for seed file
 */
const seedsTemplate = `
exports.config = { transaction: false };

/**
 * @param {import("knex").Knex} knex
 */
exports.seed = function (knex) {
  // seed process
};
`.trim();

program
  .command("make:migration <name>")
  .description("Create a new migration file")
  .action(async (name) => {
    const timestamp = Date.now();
    const filename = `${timestamp}_${name}.js`;
    const path = `${migrationsDir}/${filename}`;
    if (!fs.existsSync(path)) {
      fs.writeFileSync(path, migrationTemplate);
      console.log(`created ${path}`);
    }
  });

program
  .command("make:seed <name>")
  .description("Create a new seed file")
  .action(async (name) => {
    const filename = `${name}.js`;
    const path = `${seedsDir}/${filename}`;
    if (!fs.existsSync(path)) {
      fs.writeFileSync(path, seedsTemplate);
      console.log(`created ${path}`);
    }
  });

program
  .command("migrate")
  .description("Run all pending migrations")
  .action(async () => {
    console.log("Migrating to latest...");
    const [batchId, deployments] = await client.migrate.latest();
    if (deployments.length > 0) {
      console.log("deployed batch id:", batchId);
      console.log(deployments.join("\n"));
    } else {
      console.log("Already up to date.");
    }
    process.exit(0);
  });

program
  .command("rollback")
  .description("Rollback the last batch of migrations")
  .action(async () => {
    console.log("Rolling back...");
    const [batchId, rolledback] = await client.migrate.rollback();
    if (rolledback.length > 0) {
      console.log("rolledback batch id:", batchId);
      console.log(rolledback.join("\n"));
    } else {
      console.log("Nothing to rollback.");
    }
    process.exit(0);
  });

program.parse(process.argv);
