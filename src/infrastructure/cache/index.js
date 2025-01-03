const { config } = require("../../startup/environment");

// monkey patching the cache interface based on the environment variable
if (config.get("redis.url")) {
  require("./redis-cache");
} else {
  require("./node-cache");
}

const cache = require("./cache-interface");

module.exports = {
  cache,
};
