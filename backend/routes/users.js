const router = require('express').Router();
const { celebrate } = require('celebrate');

const userValidator = require('../utils/validators/userValidator');

const {
  getUsers,
  getUserById,
  getUserByMe,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', celebrate(userValidator.userID), getUserByMe);
router.get('/:id', celebrate(userValidator.userID), getUserById);
router.patch('/me', celebrate(userValidator.updateUser), updateUser);
router.patch('/me/avatar', celebrate(userValidator.updateAvatar), updateUserAvatar);

module.exports = router;
