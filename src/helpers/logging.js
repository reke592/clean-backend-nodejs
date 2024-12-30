const {
  LOGS_DIR,
  LOG_MAX_SIZE,
  LOG_RETENTION,
  LOG_FILENAME,
  isProduction,
} = require("../startup/environment");
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, json } = format;
const DailyRotateFile = require("winston-daily-rotate-file");

const consoleTransport = new transports.Console({
  format: format.combine(
    format.colorize(),
    format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
});

const logger = createLogger({
  format: combine(timestamp(), json()),
  transports: [
    // TODO: http transport for production environment
    ...(isProduction ? [] : [consoleTransport]),
    new DailyRotateFile({
      filename: `${LOGS_DIR}/%DATE%-${LOG_FILENAME}`,
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: LOG_MAX_SIZE,
      maxFiles: LOG_RETENTION,
    }),
  ],
});

module.exports = {
  logger,
};
