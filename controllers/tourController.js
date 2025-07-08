// const fs = require('fs');
//eslint-disable-next-line
const Tour = require('./../models/tourModel');

const AppError = require('../utils/appError');
// const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
// );

// exports.checkID = (req, res, next, val) => {
//   console.log(`The tour id is: ${val}`);
//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'invalid Id',
//     });
//   }
//   next();
// };

// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'error',
//       mesage: 'Missing body name or price',
//     });
//   }
//   next();
// };

///2. ROUTE HANDLERS

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getTours = factory.getAll(Tour);
//  catchAsync(async (req, res) => {
//First coding
// try {
//   ///TEST

//   const features = new APIFeatures(Tour.find(), req.query)
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate();

//   const tours = await features.query;
//   // const tours = await query;

//   res.status(200).json({
//     status: 'success',
//     result: tours.length,
//     data: {
//       tours,
//     },
//   });
//   // } catch (err) {
//   //   res.status(404).json({
//   //     status: 'Failed',
//   //     message: err.message,
//   //   });
//   // }
// });

// console.log(req.query);
//BUILD THE QUERY
//1a.) FILTERING
// const queryObj = { ...req.query };
// const excludedField = ['sort', 'filter', 'limit', 'page', 'fields'];
// excludedField.forEach((el) => delete queryObj[el]);

//1B.)ADVANCE FILTERING
// let queryStr = JSON.stringify(queryObj);
// queryStr = queryStr.replace(
//   /\b(gte|gt|lte|lt)\b/g,
//   (match) => `$ ${match}`,
// );

// console.log(queryStr);
// console.log(queryObj);
// let query = Tour.find(JSON.parse(queryStr));

// //2.)SORTING
// if (req.query.sort) {
//   const sortBy = req.query.sort.split(',').join(' ');

//   query = query.sort(sortBy);
// } else {
//   query = query.sort('-createdAt');
// }

//3.) FIELD LIMITING

// if (req.query.fields) {
//   const fields = req.query.fields.split(',').join(' ');

//   query = query.select(fields);
// } else {
//   query = query.select('-__v');
// }

//4.)  Pagination
// const page = req.query.page * 1 || 1;
// const limit = req.query.limit * 1 || 100;
// const skip = (page - 1) * limit;
// //
// query = query.skip(skip).limit(limit);

// if (req.query.page) {

// exports.createTour = async (req, res) => {
exports.createTour = factory.createOne(Tour);
//SECOND
// catchAsync(async (req, res) => {
//   const newTour = await Tour.create(req.body);
//   res.status(201).json({
//     status: 'successful',
//     // result: tours.length,
//     data: {
//       tour: newTour,
//     },
//   });
///First
// try {
// console.log(req.body)
// const newId = tours[tours.length * 1].id + 1;

//     });
//   },
// );
//1. first way to create a doc
// const newTour = new Tour({})
// newTour.save()

//2. create  document through create method
// const newTour = await Tour.create(req.body);
// res.status(201).json({
//   status: 'successful',
//   // result: tours.length,
//   data: {
//     tour: newTour,
//   },
// });
// res.send("Done")
// } catch (err) {
//   res.status(400).json({
//     status: 'fail',
//     message: err,
//   });
// }
// });

exports.getTour = factory.getOne(Tour, { path: 'reviews' });
// catchAsync(async (req, res, next) => {
// try {
//   const tour = await Tour.findById(req.params.id).populate('reviews');
//   // console.log(req.params)
//   // const id = req.params.id * 1;
//   // const tour = tours.find((el) => el.id === id);

//   // if (!tour) {
//   //   res.status(404).json({
//   //     status: "fail",
//   //     message: "Invalid Id",
//   //   });
//   // }
//   if (!tour) {
//     return next(new AppError('No tour found with that ID', 404));
//   }
//   res.status(200).json({
//     status: 'successful',
//     data: {
//       tour,
//     },
//   });
//   // } catch (err) {
//   //   res.status(404).json({
//   //     status: 'Failed',
//   //     message: err,
//   //   });
//   // }
// });
exports.updateTour = factory.updateOne(Tour);
// // catchAsync(async (req, res, next) => {
//   // try {
//   const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   });

//   if (!tour) {
//     return next(new AppError('No tour found with that ID', 404));
//   }
//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour: tour,
//     },
//   });
// } catch (err) {
//   res.status(404).json({
//     status: 'Failed',
//     message: err,
//   });
// }
// });

exports.deleteTour = factory.deleteOne(Tour);
// exports.deleteTour = catchAsync(async (req, res, next) => {
//   // try {
//   //eslint-disable-next-line
//   const tour = await Tour.findByIdAndDelete(req.params.id);
//   // if (req.params.id * 1 > tours.length) {
//   //   res.status(404).json({
//   //     status: "Failed",
//   //     message: "invalid id",
//   //   });
//   // }
//   if (!tour) {
//     return next(new AppError('No tour found with that ID', 404));
//   }
//   res.status(204).json({
//     status: 'Success',
//     data: null,
//   });
//   // } catch (err) {
//   //   res.status(404).json({
//   //     status: 'failed',
//   //     message: err,
//   //   });
//   // }
// });

exports.getTourStats = catchAsync(async (req, res) => {
  // try {
  const stat = await Tour.aggregate([
    { $match: { ratingsAverage: { $gte: 4.5 } } },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    { $sort: { avgPrice: 1 } },
  ]);

  res.status(200).json({
    status: 'Successful',
    data: {
      stat,
    },
  });
  // } catch (err) {
  //   res.status(404).json({
  //     status: 'failed',
  //     message: err,
  //   });
  // }
});

exports.getMonthlyPlan = catchAsync(async (req, res) => {
  // try {
  const year = req.params.year * 1;

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numToursStart: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    { $project: { id: 0 } },
    {
      $sort: { numToursStart: -1 },
    },
    {
      $limit: 12,
    },
  ]);
  res.status(200).json({
    status: 'Successful',
    data: {
      plan,
    },
  });
  // } catch (err) {
  //   res.status(404).json({
  //     status: 'failed',
  //     message: err,
  //   });
  // }
});
// /tour-withIn/:distance/center/:latlng/unit/:unit
// /tour-withIn?:distance&center=latlng&unit=mi
exports.getToursWithin = catchAsync(async (req, res) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  if (!lat || !lng)
    return new AppError(
      'Please provide latitude and longitude in the format lat,lng.',
      400,
    );
  const radius = unit === 'mi' ? distance / 6378 : distance / 3963;

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    status: 'successful',
    result: tours.length,
    data: {
      data: tours,
    },
  });
});
exports.getDistances = catchAsync(async (req, res) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;
  if (!lat || !lng)
    return new AppError(
      'Please provide latitude and longitude in the format lat,lng.',
      400,
    );
  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);
  console.log(unit);
  res.status(200).json({
    status: 'successful',

    data: {
      data: distances,
    },
  });
});
