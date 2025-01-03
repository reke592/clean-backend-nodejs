const redis = require("redis");
const implement = require("./cache-interface");
const { logger } = require("../../helpers/logging");
const { config } = require("../../startup/environment");

let isReady = false;
let interval = null;
let lastError = null;

const client = redis.createClient({
  url: config.get("redis.url"),
});

client.on("ready", () => {
  logger.info(`PID ${process.pid}, redis connection ready`);
  clearInterval(interval);
  interval = null;
  lastError = null;
  isReady = true;
});

client.on("error", (err) => {
  isReady = false;
  lastError = err;
  // throttle error logging
  if (!interval) {
    logger.error(`PID ${process.pid}, redis: ${lastError.code}`);
    interval = setInterval(() => {
      if (!isReady) {
        logger.warn(
          `PID ${process.pid}, redis connection error: ${lastError.code}`
        );
      }
    }, 5000);
  }
});

client.connect();

const shutdown = (signal) => async () => {
  logger.warn(
    `PID ${process.pid} received ${signal}, closing redis connection.`
  );
  client.quit();
};

process.on("SIGINT", shutdown("SIGINT"));
process.on("SIGTERM", shutdown("SIGTERM"));

implement.getOrDefault = async (key, cbOrValue, expire) => {
  // prevent backend from crashing if redis is not ready
  if (!isReady) {
    return typeof cbOrValue === "function" ? await cbOrValue() : cbOrValue;
  }

  let value = await client.get(key);
  if (!value) {
    if (typeof cbOrValue === "function") {
      value = await cbOrValue();
    } else {
      value = cbOrValue;
    }
    client.set(key, value, "EX", expire);
  }

  return value;
};

implement.remove = async (key) => {
  client.del(key);
};
