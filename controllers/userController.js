const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  //1. Create error if user POST password
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400,
      ),
    );
  }
  //2. Filter out unwanted field names that are not wanted.
  //only allow name and email
  const filteredObj = filterObj(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredObj, {
    new: true,
    runValidators: true,
  });
  //3. Update user details

  res.status(200).json({
    status: 'success',

    data: {
      user: updatedUser,
    },
  });
});

exports.updateMyPassword = (req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: 'This route hasnot be defned',
  });
};

exports.deleteMe = catchAsync(async (req, res, next) => {
  //1. find user by id and update active status
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'successfully deleted',
    data: null,
  });
});
exports.getUsers = factory.getAll(User);
//  catchAsync(async (req, res) => {
//   const users = await User.find();
//   res.status(200).json({
//     status: 'success',
//     results: users.length,
//     data: {
//       users,
//     },
//   });
// });

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route hasnot be defined. Please use /signup',
  });
};

exports.getUser = factory.getOne(User);
// (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route hasnot be defned',
//   });
// };

exports.updateUser = factory.updateOne(User);
//  (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route hasnot be defned',
//   });
// };

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route hasnot be defned',
  });
};
