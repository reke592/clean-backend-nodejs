// startup configurations
const { TRUST_PROXY } = require("./startup/environment");

const express = require("express");
require("express-async-errors");

const app = express();
const router = express.Router();
const http = require("http");

// server configurations
app.set("trust proxy", TRUST_PROXY); // trust number of proxies
app.set("x-powered-by", false); // disable server tokens
app.use(express.json()); // parse request body as json
app.use(require("./api/middlewares/request-logging")); // log requests and responses, see .env.sample
app.use("/api", router); // prefix all routes with /api

// public routes
router.use("/device-a", require("./api/controllers/device-a"));

// private routes
router.use(require("./api/middlewares/auth"));
router.use("/device-b", require("./api/controllers/device-b"));

// central error handler
router.use("*", require("./api/middlewares/error-handler"));

module.exports = new http.Server(app);
