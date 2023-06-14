const { unauthorizedError } = require('../constants');

module.exports = class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = unauthorizedError;
  }
};
