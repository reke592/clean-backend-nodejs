// startup configurations
const { TRUST_PROXY } = require("./startup/environment");

const express = require("express");
require("express-async-errors");

const app = express();
const router = express.Router();
const http = require("http");

// routes
router.use("/device-a", require("./api/controllers/device-a"));
router.use("/device-b", require("./api/controllers/device-b"));

// server configurations
app.set("trust proxy", TRUST_PROXY);

// prefix all routes with /api
app.use("/api", router);

module.exports = new http.Server(app);
