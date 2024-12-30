const cron = require("node-cron");

const numberOrDefault = (value, defaultValue) => {
  const number = Number(`${value}`.trim());
  return isNaN(number) ? defaultValue : number;
};

const cronScheduleOrDefault = (value, defaultValue) => {
  try {
    return cron.validate(value) ? value : defaultValue;
  } catch (error) {
    return defaultValue;
  }
};

const isAgreed = (value) => {
  return value === "true" || value === "yes" || value === "1";
};

module.exports = {
  numberOrDefault,
  cronScheduleOrDefault,
  isAgreed,
};
