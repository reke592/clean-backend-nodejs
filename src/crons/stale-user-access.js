const { CRON_CHECK_STALE_USER_ACCESS } = require("../startup/environment");
const debug = require("debug")("app:crons:stale-user-access");
const cron = require("node-cron");

debug("starting cron schedule..");
const schedule = cron.schedule(CRON_CHECK_STALE_USER_ACCESS, async () => {
  debug("check stale user access");
});

process.on("SIGINT", () => {
  debug("stopping cron schedule..");
  schedule.stop();
});

process.on("SIGTERM", () => {
  debug("stopping cron schedule..");
  schedule.stop();
});
