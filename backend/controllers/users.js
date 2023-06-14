const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
} = require('../utils/errors');
const {
  saltRounds,
  mongoDuplicateKeyError,
  createdStatus,
  jwtSecret,
} = require('../utils/constants');

// Errors: 500 - server error
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

// Errors: 400 - bad request, 404 - not found, 500 - server error
const getUser = (id, res, next) => {
  User.findById(id)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError(`Не найден пользователь с id ${id}`));
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError(`Некорректный id пользователя ${id}`));
      }
      return next(err);
    });
};

const getUserById = (req, res, next) => {
  getUser(req.params.id, res, next);
};

const getUserByMe = (req, res, next) => {
  getUser(req.user, res, next);
};

// Errors: 400 - bad request, 409 - conflict, 500 - server error
const createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  bcrypt
    .hash(password, saltRounds)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => {
      // send user without password
      res
        .status(createdStatus)
        .send({
          data: {
            email: user.email,
            name: user.name,
            about: user.about,
            avatar: user.avatar,
          },
        });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      }
      if (err.code === mongoDuplicateKeyError) {
        return next(new ConflictError('Пользователь с таким email уже существует'));
      }
      return next(err);
    });
};

// Errors: 400 - bad request, 404 - not found, 500 - server error
const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((user) => {
      if (!user) {
        return next(new NotFoundError(`Не найден пользователь с id ${req.user._id}`));
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
      }
      return next(err);
    });
};

// Errors: 400 - bad request, 404 - not found, 500 - server error
const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((user) => {
      if (!user) {
        return next(new NotFoundError(`Не найден пользователь с id ${req.user._id}`));
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(
          'Переданы некорректные данные при обновлении аватара',
        ));
      }
      return next(err);
    });
};

// Errors: 400 - bad request, 500 - server error
const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, jwtSecret, { expiresIn: '7d' });
      res.cookie('token', token, {
        httpOnly: true,
      });
      res.status(200).send({ message: 'Авторизация прошла успешно' });
    })
    .catch((err) => {
      next(new UnauthorizedError(err.message));
    });
};

module.exports = {
  getUsers,
  getUserById,
  getUserByMe,
  createUser,
  updateUser,
  updateUserAvatar,
  login,
};
