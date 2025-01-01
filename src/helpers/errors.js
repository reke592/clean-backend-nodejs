/**
 * common error class visible to the client
 */
class PublicError extends Error {
  constructor(message, code, name) {
    super(message);
    this.name = name;
    this.statusCode = code;
  }
}

class ErrorUnauthorized extends PublicError {
  constructor(message) {
    super(message, 401, "Unauthorized");
  }
}

class ErrorBadRequest extends PublicError {
  constructor(message) {
    super(message, 400, "BadRequest");
  }
}

module.exports = {
  PublicError,
  ErrorBadRequest,
  ErrorUnauthorized,
};
