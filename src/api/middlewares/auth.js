const { ErrorUnauthorized } = require("../../helpers/errors");

module.exports = function (req, res, next) {
  // TODO: implement JWT token verification
  if (!req.headers.authorization) {
    return next(new ErrorUnauthorized("resource access not allowed."));
  }
  next();
};
