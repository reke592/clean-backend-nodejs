const router = require("express").Router();

router.get("/", (req, res) => {
  res.status(200).send("Hello from model-a");
});

module.exports = router;
