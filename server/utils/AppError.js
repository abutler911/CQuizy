// src/utils/AppError.js
/**
 * Custom error class for application errors
 */
class AppError extends Error {
  /**
   * Create a new AppError
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   * @param {string} errorCode - Application error code
   * @param {*} details - Additional error details
   */
  constructor(message, statusCode, errorCode, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    this.isOperational = true; // Indicates this is an expected operational error

    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Create a 400 Bad Request error
   * @param {string} message - Error message
   * @param {string} errorCode - Application error code
   * @param {*} details - Additional error details
   * @returns {AppError} The created error
   */
  static badRequest(
    message = "Bad request",
    errorCode = "ERR_BAD_REQUEST",
    details = null
  ) {
    return new AppError(message, 400, errorCode, details);
  }

  /**
   * Create a 401 Unauthorized error
   * @param {string} message - Error message
   * @param {string} errorCode - Application error code
   * @param {*} details - Additional error details
   * @returns {AppError} The created error
   */
  static unauthorized(
    message = "Unauthorized",
    errorCode = "ERR_UNAUTHORIZED",
    details = null
  ) {
    return new AppError(message, 401, errorCode, details);
  }

  /**
   * Create a 403 Forbidden error
   * @param {string} message - Error message
   * @param {string} errorCode - Application error code
   * @param {*} details - Additional error details
   * @returns {AppError} The created error
   */
  static forbidden(
    message = "Forbidden",
    errorCode = "ERR_FORBIDDEN",
    details = null
  ) {
    return new AppError(message, 403, errorCode, details);
  }

  /**
   * Create a 404 Not Found error
   * @param {string} message - Error message
   * @param {string} errorCode - Application error code
   * @param {*} details - Additional error details
   * @returns {AppError} The created error
   */
  static notFound(
    message = "Resource not found",
    errorCode = "ERR_NOT_FOUND",
    details = null
  ) {
    return new AppError(message, 404, errorCode, details);
  }

  /**
   * Create a 409 Conflict error
   * @param {string} message - Error message
   * @param {string} errorCode - Application error code
   * @param {*} details - Additional error details
   * @returns {AppError} The created error
   */
  static conflict(
    message = "Conflict",
    errorCode = "ERR_CONFLICT",
    details = null
  ) {
    return new AppError(message, 409, errorCode, details);
  }

  /**
   * Create a 422 Unprocessable Entity error
   * @param {string} message - Error message
   * @param {string} errorCode - Application error code
   * @param {*} details - Additional error details
   * @returns {AppError} The created error
   */
  static unprocessableEntity(
    message = "Unprocessable entity",
    errorCode = "ERR_UNPROCESSABLE",
    details = null
  ) {
    return new AppError(message, 422, errorCode, details);
  }

  /**
   * Create a 500 Internal Server Error
   * @param {string} message - Error message
   * @param {string} errorCode - Application error code
   * @param {*} details - Additional error details
   * @returns {AppError} The created error
   */
  static internal(
    message = "Internal server error",
    errorCode = "ERR_INTERNAL",
    details = null
  ) {
    return new AppError(message, 500, errorCode, details);
  }
}

export { AppError };
