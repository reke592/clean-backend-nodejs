const NodeCache = require("node-cache");
const implementations = require("./cache-interface");

const _db = new NodeCache();

implementations.getOrDefault = async (key, cbOrValue, expire) => {
  let value = _db.get(key);
  if (value === undefined) {
    if (typeof cbOrValue === "function") {
      value = await cbOrValue();
    } else {
      value = cbOrValue;
    }
    _db.set(key, value, expire);
  }
  return value;
};

implementations.remove = async (key) => {
  _db.del(key);
};
