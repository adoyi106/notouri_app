const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./userModel');

// const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      maxlength: [40, 'A tour name must have less or equal then 40 characters'],
      minlength: [10, 'A tour name must have more or equal to 10 characters'],
      // validate: [validator.isAlpha, 'A tour must be a string'],
    },
    slug: String,
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have group size'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'RatingsAverage must be more than 1.0'],
      max: [5, 'RatingsAverage must be less than 5.0'],
      set: (val) => Math.round(val * 10) / 10, //4.6666 //4.7
    },
    difficulty: {
      type: String,
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium or difficult',
      },
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    discountPrice: {
      type: Number,
      validate: {
        // this only points to current doc on NEW document creation
        validator: function (val) {
          return val < this.price;
        },
        message: 'Discount price ({value}) should be below regular price ',
      },
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    secretTour: {
      type: Boolean,
      default: false,
    },
    images: [String],
    startDates: [Date],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startLocation: {
      //GeoJson
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      description: String,
      address: String,
    },
    locations: [
{

  type: {
    type: String,
    default: 'Point',
    enum: ['Point'],
  },
  coordinates: [Number],
  description: String,
  day: Number,
  address: String,
}
    ]
    ,
    // guides: Array,
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    reviewer: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Review',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

tourSchema.index({ price: 1, ratingAverage: -1 });
tourSchema.index({ startLocation: '2dsphere' });

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});
//DOCUMENT MIDDLEWARE: runs before .save() and .create()

tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//for emedding
// tourSchema.pre('save', async function (next) {
//   const guidePromise = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidePromise);
//   next();
// });
//QUERY MIDDLEWARE
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v, -passwordChangedAt',
  });
  next();
});
tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);

  next();
});

//AGGREGATe MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  //First code
  // this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

  //Second code
  const pipeline = this.pipeline();
  //if goeNear is the first in the pipeline
  if (pipeline.length && pipeline[0].$geoNear) {
    //add $match to second slot
    pipeline.splice(1, 0, { $match: { secretTour: { $ne: true } } });
  } else {
    //if $ isn't the first, just add $match
    pipeline.unshift({ $match: { secretTour: { $ne: true } } });
  }
  console.log(this.pipeline());
  next();
});
// eslint-disable-line prefer-arrow-callback
// tourSchema.pre('save', (next) => {
//   console.log('Will save doc');
//   next();
// });

// // eslint-disable-line
// tourSchema.post('save', (doc, next) => {
//   console.log(doc);
//   next();
// });
// Creating a model from the schema
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
