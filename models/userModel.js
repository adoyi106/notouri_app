const mongoose = require('mongoose');
const crypto = require('crypto');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please, rpovide a name'],
  },
  email: {
    type: String,
    required: [true, 'Please, provide an email'],
    lowercase: true,
    unique: true,
    validate: [validator.isEmail],
  },
  photo: {
    type: String,
    // required: [true, 'Please, provide a photo'],
  },
  role: {
    type: String,
    enum: ['admin', 'lead-guide', 'tour guide', 'user'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please, provide a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please, confirm your password'],
    validate: {
      // // this only points to current doc on NEW document creation on save and create
      validator: function (val) {
        return val === this.password;
      },
      message: 'Passwords are not same',
    },
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  passwordChangedAt: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

//Encrypt password before it reaches database
userSchema.pre('save', async function (next) {
  //return this if this password is modified
  if (!this.isModified('password')) return next();

  //Hash the password and cost it to 12
  this.password = await bcrypt.hash(this.password, 12);

  //Delete confirm password
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', async function (next) {
  //return this if password is not modified and its a new doc
  if (!this.isModified('password') || this.isNew) return next();

  //set change at
  this.passwordChangedAt = Date.now() - 1000;
  //run next middleware
  next();
});

userSchema.pre(/^find/, function (next) {
  //point to current doc
  this.find({ active: { $ne: false } });
  next();
});
//run an instance method to check passwordChange

userSchema.methods.passwordChangedAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    // return changedTimeStamp;

    return JWTTimeStamp < changedTimeStamp;
  }
  return false;
};
//run an instant method to check the incoming password and the harshed password
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};
const User = mongoose.model('User', userSchema);

module.exports = User;
