const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Joi = require('joi'); // for validating js objects on post requests
const Fawn = require('fawn');
Fawn.init(mongoose);
const Rental = require('../models/rental');
const { User } = require('../models/user');
const { Movie } = require('../models/movie');

// GET ALL RENTALS
router.get('', async (req, res) => {
  const rentals = await Rental.find().sort('-dateOut');
  res.send(rentals);
});
// ADD A NEW RENTAL
router.post('', async (req, res) => {
  const rentalShape = {
    userId: Joi.string().required(),
    movieId: Joi.string().required()
  };
  const { error } = Joi.validate(req.body, rentalShape);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const user = await User.findById(req.body.userId);
  if (!user) {
    return res.status(404).send('There is no user with provided id!');
  }
  const movie = await Movie.findById(req.body.movieId);
  if (!movie) {
    return res.status(404).send('There is no movie with provided id!');
  }
  if (movie.numberInStock === 0) {
    return res.status(400).send('Movie not in stock.');
  }
  let rental = new Rental({
    user: {
      _id: user._id,
      name: user.name,
      /* email: user.email,
      password: user.password,
      isAdmin: user.isAdmin, */
      isGold: user.isGold,
      phone: user.phone
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    }
  });

  try {
    new Fawn.Task()
      .save('rentals', rental)
      .update('movies', { _id: movie._id }, { $inc: { numberInStock: -1 } })
      .run();
    return res.send(rental);
  } catch (err) {
    res.status(500).send('Something failed', err);
  }
  res.send(rental);
});

module.exports = router;
