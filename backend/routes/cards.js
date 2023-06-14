const router = require('express').Router();
const { celebrate } = require('celebrate');
const checkCardOwner = require('../middlewares/check-card-owner');
const cardValidator = require('../utils/validators/cardValidator');

const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.post('/', celebrate(cardValidator.createCard), createCard);
router.get('/', getCards);
router.delete('/:cardId', celebrate(cardValidator.cardId), checkCardOwner, deleteCard);
router.delete('/:cardId/likes', celebrate(cardValidator.cardId), dislikeCard);
router.put('/:cardId/likes', celebrate(cardValidator.cardId), likeCard);

module.exports = router;
