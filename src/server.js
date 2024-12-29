const express = require("express");
const app = express();

// routes
app.use("/api/model-a", require("./api/controllers/model-a"));
app.use("/api/model-b", require("./api/controllers/model-b"));

module.exports = app;
