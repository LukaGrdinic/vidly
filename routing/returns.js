const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Rental = require("../models/rental");
const { Movie } = require("../models/movie");
const moment = require("moment");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const validate = require('../middleware/validate');

router.post("/", [auth, validate(validateReturn)], async (req, res, next) => {

  if (!req.body.customerId) {
    return res.status(400).send("customerId is not provided");
  }
  if (!req.body.movieId) {
    return res.status(400).send("movieId is not provided");
  }

  const rental = await Rental.findOne({ "customer._id": req.body.customerId, "movie._id": req.body.movieId });
  if (!rental) {
    return res.status(404).send("Rental not found.");
  }

  if (rental.dateReturned) {
    return res.status(400).send("Return is already processed");
  }

  rental.dateReturned = new Date();
  const rentalDays = moment().diff(rental.dateOut, "days");
  rental.rentalFee = rentalDays * rental.movie.dailyRentalRate;
  await rental.save();

  await Movie.update(
    { _id: rental.movie._id },
    {
      $inc: { numberInStock: 1 }
    }
  );

  return res.status(200).send(rental);
});

function validateReturn(req) {
  const schema = {
    customerId: Joi.objectId().required(), // objectId() validator? Joi.objectId
    movieId: Joi.objectId().required()
  };

  return Joi.validate(req, schema);
}

module.exports = router;
