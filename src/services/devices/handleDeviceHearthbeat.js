const { COMMAND_OPTIONS } = require("../../helpers/constants");
const { logger } = require("../../helpers/logging");

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
  logger.info("Device hearthbeat", params);
};

module.exports = { handleDeviceHearthbeat };
