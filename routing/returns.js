const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Rental = require("../models/rental");
const { Movie } = require("../models/movie");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const validate = require('../middleware/validate');

router.post("/", [auth, validate(validateReturn)], async (req, res, next) => {

  const rental = await Rental.lookup(req.body.userId, req.body.movieId); // FINDS ONLY RENTALS THAT ARE NOT RETURNED

  if (!rental) {
    return res.status(404).send("Rental not found or already processed.");
  }

  /* if (rental.dateReturned) {
    return res.status(400).send("Return is already processed");
  } */

  rental.return();

  await rental.save();

  await Movie.update(
    { _id: rental.movie._id },
    {
      $inc: { numberInStock: 1 }
    }
  );

  return res.send(rental);
});

function validateReturn(req) {
  const schema = {
    userId: Joi.objectId().required(), // objectId() validator? Joi.objectId
    movieId: Joi.objectId().required()
  };

  return Joi.validate(req, schema);
}

module.exports = router;
