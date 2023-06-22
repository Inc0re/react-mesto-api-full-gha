const Card = require('../models/card');
const {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} = require('../utils/errors');

// temp admin id
const adminID = '648ab71fe3e10613f490ce25';

module.exports = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        next(new NotFoundError(`Нет карточки с id ${req.params.cardId}`));
        // temp admin id
      } else if (card.owner.toString() !== req.user._id && req.user._id !== adminID) {
        next(new ForbiddenError('Нет прав на удаление'));
      } else {
        next();
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(`Некорректный id карточки ${req.params.cardId}`));
      } else {
        next(err);
      }
    });
};
