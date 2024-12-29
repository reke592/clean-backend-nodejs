const redis = require("redis");
const implementations = require("./cache-interface");

const client = redis.createClient();

let isReady = false;

client.on("ready", () => {
  isReady = true;
});

client.on("error", (err) => {
  isReady = false;
});

implementations.getOrDefault = async (key, cbOrValue, expire) => {
  // prevent backend from crashing if redis is not ready
  if (!isReady) {
    return cbOrValue;
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

implementations.remove = async (key) => {
  client.del(key);
};
