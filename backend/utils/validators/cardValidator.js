const { Joi } = require('celebrate');
const { urlTemplate } = require('../constants');

module.exports = {
  createCard: {
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().pattern(urlTemplate),
    }),
  },
  cardId: {
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24),
    }),
  },
};
