/**
 * get or set value to cache
 * @param {string} key unique key
 * @param {*} cbOrValue callback function or value
 * @param {number} expire in seconds
 */
const getOrDefault = async (key, cbOrValue, expire) => {
  throw new Error("Method not implemented.");
};

/**
 * remove value from cache
 * @param {string} key
 */
const remove = async (key) => {
  throw new Error("Method not implemented.");
};

module.exports = { getOrDefault, remove };
