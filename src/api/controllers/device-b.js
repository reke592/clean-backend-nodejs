const router = require("express").Router();
const {
  handleDeviceHearthbeat,
} = require("../../services/devices/handleDeviceHearthbeat");

router.get("/", async (req, res) => {
  await handleDeviceHearthbeat(
    {
      serialNumber: "B",
      ipAddress: req.ip,
    },
    { context: req }
  );
  res.status(200).send("device B");
});

module.exports = router;
