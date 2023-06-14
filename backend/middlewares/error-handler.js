const { serverError } = require('../utils/constants');

module.exports = (err, req, res, next) => {
  const { statusCode = serverError, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === serverError
        ? 'На сервере произошла ошибка'
        : message,
    });

  next();
};
