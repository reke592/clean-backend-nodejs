const { LOGS_DIR } = require("../startup/environment");
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf } = format;
const DailyRotateFile = require("winston-daily-rotate-file");
const cluster = require("cluster").default || require("cluster");

const id = cluster.worker?.id || "M";

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${id} ${level}: ${message}`;
});

const logger = createLogger({
  format: combine(timestamp(), logFormat),
  transports: [
    new transports.Console(),
    new DailyRotateFile({
      filename: `${LOGS_DIR}/%DATE%-app.log`,
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
  ],
});

module.exports = {
  logger,
};
