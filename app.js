const dotenv = require('dotenv');

const path = require('path');
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors')
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

dotenv.config({ path: './config.env' });
// const fs = require('fs');

const morgan = require('morgan');

const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');
const reviewRouter = require('./routes/reviewRouter');
// const viewRouter = require('./routes/viewRouter');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

//pug integration
app.set('trust proxy', 1);
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//Global Middleware

app.use(cors())

app.options("*", cors())
//read static files
app.use(express.static(`${__dirname}/public`));
app.use(helmet());
///1. MIDDLEWARES
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 100,
  message: 'Limit reached, come back after an hour!',
});

app.use('/api', limiter);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Body parser, reading data from body into req.body
app.use(
  express.json({
    limit: '10kb',
  }),
);

//Data sanitization  against NOSQL query injection
app.use(mongoSanitize());

//Data  sanitization against xss
app.use(xss());
//Data  sanitization against pollutedparameter
app.use(
  hpp({
    whitelist: [
      'price',
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
    ],
  }),
);

app.use((req, res, next) => {
  req.requireTime = new Date().toISOString();

  next();
});

////////////////////Users

/////////////////////////////////////////////////
//2. refactor the end point
// app.get("/api/v1/tours", getTours);

// app.post("/api/v1/tours", createTour);
// app.get("/api/v1/tours/:id/:x?", (req, res)=>{}
//url params Get Tour
// app.get("/api/v1/tours/:id", getTour);

//Update tour
// app.patch("/api/v1/tours/:id", updateTour);
//Delete Tour
// app.delete("/api/v1/tours/:id", deleteTour);

//3. Routes
//mounting the routers

// // app.route("/api/v1/users").get(getUsers).post(createUser);
// userRouter.route("/").get(getUsers).post(createUser);
// userRouter.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);
// app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

// app.use((req, res, next) => {
//   console.log(Object.getOwnPropertyNames(Error.prototype));
//   next();
// });
app.use('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'failed',
  //   message: `Can't find ${req.originalUrl} on the server`,
  // });

  //Second written code
  // const err = new Error(`Can't find ${req.originalUrl} on the server`);
  // err.statusCode = 404;
  // err.status = 'Failed';
  // next(err);

  //3rd
  next(new AppError(`Can't find ${req.originalUrl} on the server`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
