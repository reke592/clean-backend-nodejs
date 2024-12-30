const { logger } = require("../helpers/logging");
const { CRON_CHECK_STALE_USER_ACCESS } = require("../startup/environment");
const cron = require("node-cron");

logger.info(`starting cron: stale-user-access ${CRON_CHECK_STALE_USER_ACCESS}`);
const schedule = cron.schedule(CRON_CHECK_STALE_USER_ACCESS, async () => {
  logger.info("check stale user access");
});

const shutdown = (signal) => () => {
  logger.warn("stopping cron: stale-user-access");
  schedule.stop();
};

process.on("SIGINT", shutdown("SIGINT"));
process.on("SIGTERM", shutdown("SIGINT"));
