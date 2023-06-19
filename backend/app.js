/* eslint-disable no-console */
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { celebrate, errors } = require('celebrate');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { NotFoundError } = require('./utils/errors');
const { login, createUser, logOut } = require('./controllers/users');
const auth = require('./middlewares/auth');
const userValidator = require('./utils/validators/userValidator');
const errorHandler = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const app = express();

app.use(
  cors({
    origin: ['http://localhost:3000', 'https://mesto-app.nomoredomains.rocks'],
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  }),
);

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Request logger
app.use(requestLogger);

// Crash test app
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// Unprotected routes
app.post('/signin', celebrate(userValidator.createOrLogin), login);
app.post('/signup', celebrate(userValidator.createOrLogin), createUser);
// Log out
app.get('/logout', logOut);

// Protected routes
app.use('/users', auth, usersRouter);
app.use('/cards', auth, cardsRouter);
app.use(auth, (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

// Error logger
app.use(errorLogger);

// Celebrate errors
app.use(errors());

// Handle errors
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
