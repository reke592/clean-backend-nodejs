const { logger } = require("../helpers/logging");
const { CRON_CHECK_STALE_USER_ACCESS } = require("../startup/environment");

exports.schedule = CRON_CHECK_STALE_USER_ACCESS;

exports.job = async () => {
  logger.info("check stale user access");
};
