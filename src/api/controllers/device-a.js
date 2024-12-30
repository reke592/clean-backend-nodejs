const {
  handleDeviceHearthbeat,
} = require("../../services/devices/handleDeviceHearthbeat");

const router = require("express").Router();

router.get("/", async (req, res) => {
  await handleDeviceHearthbeat(
    {
      serialNumber: "A",
      ipAddress: req.ip,
    },
    { context: req }
  );
  res.status(200).send("device A");
});

module.exports = router;
