const { forbiddenError } = require('../constants');

module.exports = class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = forbiddenError;
  }
};
