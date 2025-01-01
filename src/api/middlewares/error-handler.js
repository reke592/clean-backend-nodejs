const { PublicError } = require("../../helpers/errors");
const { logger } = require("../../helpers/logging");

module.exports = async (error, req, res, next) => {
  // always log the error
  logger.error(error.stack);

  // if the error is a PublicError, return the error message
  if (error instanceof PublicError) {
    res.status(error.statusCode).json({
      error: error.name,
      code: error.statusCode,
      message: error.message,
    });
  } else {
    // return static message for internal server errors
    // TODO: send stacktrace to real-time monitoring service
    res.status(500).json({
      error: "InternalServerError",
      code: 500,
      message: "Internal server error",
    });
  }
};
