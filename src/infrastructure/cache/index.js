// monkey patching the cache interface based on the environment variable
if (process.env.REDIS) {
  require("./redis-cache");
} else {
  require("./node-cache");
}

const cache = require("./cache-interface");

module.exports = {
  cache,
};
