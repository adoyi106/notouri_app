const Tours = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
  //1. Get Tour colection
  const tours = await Tours.find();
  //2. Build template
  //3. render each tours
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});
exports.getTour = (req, res) => {
  res.status(200).render('tours', {
    title: 'The Forest Hiker Tour',
  });
};
