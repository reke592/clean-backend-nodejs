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

module.exports = { numberOrDefault, cronScheduleOrDefault };
