const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const crypto = require('crypto');

const dotenv = require('dotenv');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const sendEmail = require('../utils/email');

dotenv.config({ path: './config.env' });

const signinToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, res) => {
  const token = signinToken(user._id);
  const cookieOptions = {
    expire: new Date(
      Date.now() * process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};
exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    role: req.body.role,
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    photo: req.body.photo,
    active: req.body.actve,
  });

  //Add passwordChangedAt if it exists
  if (req.body.passwordChangedAt) {
    newUser.passwordChangedAt = req.body.passwordChangedAt;
  }
  if (req.body.photo) {
    newUser.photo = req.body.photo;
  }

  //   const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
  //     expiresIn: process.env.JWT_EXPIRES_IN,
  //   });
  // const token = signinToken(newUser._id);
  // res.status(201).json({
  //   status: 'Succesfully created!',
  //   token,
  //   data: {
  //     user: newUser,
  //   },
  // });
  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //1. Check if there is email and password

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  //2. Check if user and password exist
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Please provide valid email and password!', 401));
  }

  //3 if everything checks then send token
  // const token = signinToken(user._id);

  // res.status(200).json({
  //   status: 'Sucessful',
  //   token,
  //   data: {
  //     user,
  //   },
  // });

  createSendToken(user, 200, res);
});
exports.protect = catchAsync(async (req, res, next) => {
  //1.)Getting token and verifying if it there.
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You arenot logged in! Please login to get access.', 401),
    );
  }
  //2. Token verification
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //3. check if the user exist
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError(
        'Please the user belonging to this token no longer exist.',
        401,
      ),
    );
  }
  //check if the user change password after getting token
  if (currentUser.passwordChangedAfter(decoded.iat)) {
    next(new AppError('User recently changed password! Login again', 401));
  }

  //GRANT ACCESS to user
  req.user = currentUser;
  next();
});

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    //roles= ["admin", "lead-gide"] req.user.role=user
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          'Please you donot have permission to perform this action',
          403,
        ),
      );
    }
    next();
  };

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // console.log(req);
  //1. Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError('There is no user with this email.', 404));
  }
  //2. Generate resetPassword token

  const resetToken = user.createPasswordResetToken();

  // await user.save({ validateBeforeSave: false });
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    'host',
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
  try {
    sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500,
      ),
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //1.Get User based on token
  const hasedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hasedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  //2. If user exist and token hasnnot expired then set new password
  if (!user) {
    return next(new AppError('Token is invalid or expired', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();
  //3. Set passwordChangedAt
  //4. Log user in
  // const token = signinToken(user._id);

  // res.status(200).json({
  //   status: 'Sucessful',
  //   token,
  //   data: {
  //     user,
  //   },
  // });

  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // console.log(req);
  //1.) Get user from user collection

  const user = await User.findById(req.user.id).select('+password');

  //2.) Check if user password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Please your current password is wrong!', 401));
  }
  //3.) update new password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  //save to the user doc
  await user.save();
  //.) Log user in, send JWT
  createSendToken(user, 200, res);
});
