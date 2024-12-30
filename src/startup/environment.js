const fs = require("fs");
const path = require("path");
const envFile = process.argv[2] || ".env";
const {
  numberOrDefault,
  cronScheduleOrDefault,
} = require("../helpers/value_parsers");
const { mkdirSync } = require("../helpers/directories");

// read .env file
if (fs.existsSync(envFile)) {
  require("dotenv").config({ path: envFile });
}

/**
 * Server port, default is 3000
 */
const SERV_PORT = numberOrDefault(process.env.SERV_PORT, 3000);

/**
 * Number of workers to spawn, default is 1
 */
const CLUSTER_SIZE = numberOrDefault(process.env.CLUSTER_SIZE, 1);

/**
 * Trust proxy setting, default is 1
 */
const TRUST_PROXY = numberOrDefault(process.env.TRUST_PROXY, 1);

/**
 * Root directory of the project
 */
const ROOT_DIR = path.resolve(path.join(__dirname, "..", ".."));

/**
 * Logs directory
 */
const LOGS_DIR = mkdirSync(process.env.LOGS_DIR || path.join(ROOT_DIR, "logs"));

/**
 * Data directory
 */
const DATA_DIR = mkdirSync(process.env.DATA_DIR || path.join(ROOT_DIR, "data"));

/**
 * cron schedule to check stale user access, default is every 5 seconds
 */
const CRON_CHECK_STALE_USER_ACCESS = cronScheduleOrDefault(
  process.env.CRON_CHECK_STALE_USER_ACCESS,
  "*/5 * * * * *"
);

module.exports = {
  SERV_PORT,
  CLUSTER_SIZE,
  TRUST_PROXY,
  ROOT_DIR,
  LOGS_DIR,
  DATA_DIR,
  CRON_CHECK_STALE_USER_ACCESS,
};
