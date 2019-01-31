const mongoose = require('mongoose');
const { genreSchema } = require('./genre');

const Movie = mongoose.model(
  'Movie',
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 100
    },
    genre: {
      type: genreSchema
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0
    },
    dailyRentalRate: {
        type: Number,
        min: 0
    }
  })
);

exports.Movie = Movie;