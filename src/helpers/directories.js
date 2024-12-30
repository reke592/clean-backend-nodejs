const fs = require("fs");
const path = require("path");

/**
 * recursively create a directory
 * @returns {string} the path created
 */
const mkdirSync = (_path) => {
  // create the directory
  if (!fs.existsSync(_path)) {
    fs.mkdirSync(_path, { recursive: true });
    console.log("created", _path);
  }
  return _path;
};

/**
 * usage:
 * ```js
 * let resolved = fileExistSync(reportsDir, 'file.jasper');
 * ```
 */
const fileExistsSync = (...paths) => {
  let resolved = path.resolve(path.join(paths));
  if (fs.existsSync(resolved)) {
    return resolved;
  }
  return false;
};

module.exports = {
  mkdirSync,
  fileExistsSync,
};
