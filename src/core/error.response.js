const StatusCode = {
  FOBBIDDEN: 403,
  CONFLICT: 409,
}

const ReasonStatusCode = {
  FOBBIDDEN: 'Bad Request Error!',
  CONFLICT: 'Conflict Error!',
}

const {
  StatusCodes,
  ReasonPhrase,
} = require('../utils/httpStatusCode')

class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class ConflictResquestError extends ErrorResponse {
  constructor(message = ReasonStatusCode.CONFLICT, statusCode = StatusCode.CONFLICT) {
    super(message, statusCode);
  }
}

class BadRequestError extends ErrorResponse {
  constructor(message = ReasonStatusCode.FOBBIDDEN, statusCode = StatusCode.FOBBIDDEN) {
    super(message, statusCode);
  }
}

class AuthFailureError extends ErrorResponse {
  constructor(message = ReasonPhrase.UNAUTHORIZED, statusCode = StatusCodes.UNAUTHORIZED) {
    super(message, statusCode);
  }
}

class NotFoundError extends ErrorResponse {
  constructor(message = ReasonPhrase.NOT_FOUND, statusCode = StatusCodes.NOT_FOUND) {
    super(message, statusCode);
  }
}

module.exports = {
  ConflictResquestError,
  AuthFailureError,
  BadRequestError,
  NotFoundError,
}