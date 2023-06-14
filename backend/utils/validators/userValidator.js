const { Joi } = require('celebrate');
const { urlTemplate } = require('../constants');

module.exports = {
  createOrLogin: {
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8).max(35),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().pattern(urlTemplate),
    }),
  },
  updateUser: {
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  },
  updateAvatar: {
    body: Joi.object().keys({
      avatar: Joi.string().pattern(urlTemplate),
    }),
  },
  userID: {
    params: Joi.object().keys({
      id: Joi.string().hex().length(24),
    }),
  },
};
