const fs = require("fs");
const envFile = process.argv[2] || ".env";

if (fs.existsSync(envFile)) {
  require("dotenv").config({ path: envFile });
}

// defaults
process.env.SERV_PORT = process.env.SERV_PORT || 3000;
process.env.CLUSTER_SIZE = process.env.CLUSTER_SIZE || 1;
