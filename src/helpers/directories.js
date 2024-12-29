const fs = require("fs");
const path = require("path");

/**
 * recursively create a directory
 */
const mkdirSync = (_path) => {
  // create the directory
  if (!fs.existsSync(_path)) {
    fs.mkdirSync(_path, { recursive: true });
    console.log("created", _path);
  }
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

// backend path definitions
const rootDir = path.resolve(path.join(__dirname, "..", ".."));
const logsDir = process.env.LOGS_DIR || path.join(rootDir, "logs");
const dataDir = process.env.DATA_DIR || path.join(rootDir, "data");
const reportsDir = process.env.REPORTS_DIR || path.join(dataDir, "reports");
const uploadsDir = process.env.UPLOADS_DIR || path.join(dataDir, "uploads");

module.exports = {
  mkdirSync,
  fileExistsSync,
  rootDir,
  logsDir,
  dataDir,
  reportsDir,
  uploadsDir,
};
