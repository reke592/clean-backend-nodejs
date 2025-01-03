const fs = require("fs");
const cron = require("node-cron");
const { plogger } = require("../helpers/logging");
const { cache } = require("../infrastructure/cache");

/**
 * @typedef {Object} CronJob
 * @property {string} filename
 * @property {cron.ScheduledTask} job cron schedule
 */

/**
 * @type {CronJob[]} list of cron jobs
 */
const crons = [];

plogger.info(`PID ${process.pid} scanning for cron jobs..`);
for (let file of fs.readdirSync(__dirname)) {
  if (file === "index.js" || !file.endsWith(".js")) {
    continue;
  }

  const item = require(`./${file}`);

  // validate module require
  if (!cron.validate(item.schedule)) {
    plogger.warn(`Invalid cron schedule file: ${file}`);
  } else if (typeof item.job !== "function") {
    plogger.warn(`Invalid cron job function file: ${file}`);
  } else {
    plogger.info(`Started cron: ${file}, schedule: ${item.schedule}`);
    crons.push({
      filename: file,
      job: cron.schedule(item.schedule, () =>
        item.job().catch((err) => plogger.error(err))
      ),
    });
  }
}

const shutdown = (signal) => async () => {
  plogger.warn(
    `PID ${process.pid} received ${signal}, Stopping cron schedules.`
  );
  for (let item of crons) {
    item.job.stop();
  }
};

process.on("SIGINT", shutdown("SIGINT"));
process.on("SIGTERM", shutdown("SIGINT"));
