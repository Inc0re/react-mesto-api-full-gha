const { conflictError } = require('../constants');

module.exports = class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = conflictError;
  }
};
