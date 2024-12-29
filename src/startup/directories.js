// make sure to always read the process environment
require("./environment");

// initialize the backend directories
const dirs = require("../helpers/directories");
for (let key of Object.keys(dirs)) {
  if (typeof dirs[key] === "string") {
    dirs.mkdirSync(dirs[key]);
  }
}
