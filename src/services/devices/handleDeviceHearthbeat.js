const { COMMAND_OPTIONS } = require("../../helpers/constants");

const PARAMS = {
  /**
   * the device serial number
   */
  serialNumber: undefined,
  /**
   * the device IP address
   */
  ipAddress: undefined,
};

const handleDeviceHearthbeat = async (
  params = PARAMS,
  options = COMMAND_OPTIONS
) => {
  console.log("Device hearthbeat", params);
};

module.exports = { handleDeviceHearthbeat };
