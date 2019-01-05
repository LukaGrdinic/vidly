const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
    genreName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 20,
      trim: true
    }
  });

const Genre = mongoose.model('Genre', genreSchema);

exports.Genre = Genre;
exports.genreSchema = genreSchema;