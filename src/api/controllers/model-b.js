const router = require("express").Router();

router.get("/", (req, res) => {
  res.status(200).send("Hello from model-b");
});

module.exports = router;
