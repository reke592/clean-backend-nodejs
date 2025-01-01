const redis = require("redis");
const implement = require("./cache-interface");

const client = redis.createClient();

let isReady = false;

client.on("ready", () => {
  isReady = true;
});

client.on("error", (err) => {
  isReady = false;
});

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
