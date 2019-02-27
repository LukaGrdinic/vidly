const mongoose = require("mongoose");
const moment = require("moment");

const rentalSchema = new mongoose.Schema({
  user: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
      },
      email: {
        type: String,
        /* required: true, */
        minlength: 5,
        maxlength: 255,
      },
      password: {
        type: String,
        /* required: true, */
        minlength: 5,
        maxlength: 1024
      },
      isAdmin: {
        type: Boolean
      },
      isGold: {
        type: Boolean,
        default: false
      },
      phone: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20,
        trim: true
      }
    }),
    required: true
  },
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 255
      },
      dailyRentalRate: {
        type: Number,
        required: true,
        default: 1,
        min: 1
      }
    }),
    required: true
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now
  },
  dateReturned: {
    type: Date
  },
  rentalFee: {
    type: Number,
    min: 0
  }
});

rentalSchema.statics.lookup = function(userId, movieId) {
  return this.findOne({
    "user._id": userId,
    "movie._id": movieId,
    dateReturned: undefined // SHOULD RETURN ONLY MOVIES THAT DONT HAVE DATE RETURNED
  }); 
};

rentalSchema.methods.return = function() {
  this.dateReturned = new Date();

  const rentalDays = moment().diff(this.dateOut, "days") + 1;
  this.rentalFee = rentalDays * this.movie.dailyRentalRate;
};
const Rental = mongoose.model("Rental", rentalSchema);

module.exports = Rental;
