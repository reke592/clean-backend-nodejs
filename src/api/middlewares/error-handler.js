const { logger } = require("../../helpers/logging");

module.exports = async (error, req, res, next) => {
  logger.error(error);

  // TODO: consolidate reponse based on error type

  // return static message for internal server errors
  res.status(500).send("Internal server error");
};
