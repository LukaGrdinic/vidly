const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Joi = require('joi'); // for validating js objects on post requests
const Fawn = require('fawn');
Fawn.init(mongoose);
const  Rental  = require('../models/rental');
const Customer = require('../models/customer');
const { Movie } = require('../models/movie');

// GET ALL RENTALS
router.get('', async(req, res) => {
    const rentals = await Rental.find().sort('-dateOut');
    res.send(rentals);
});
router.post('', async(req, res) => {
    const rentalShape = {
        customerId: Joi.string().required(),
        movieId: Joi.string().required()
    };
    const {error} = Joi.validate(req.body, rentalShape);
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    const customer = await Customer.findById(req.body.customerId);
    // res with 404 if no customer found
    const movie = await Movie.findById(req.body.movieId);
    // res with 404 if no movie found

    if (movie.numberInStock === 0) {
        return res.status(400).send('Movie not in stock.');
    }

    let rental = new Rental({
        customer: {
            _id: customer._id,
            customerName: customer.customerName,
            phone: customer.phone,
        },
        movie: {
            _id: movie._id,
            title: movie.title
           /*  dailyRentalRate: movie.dailyRentalRate, */
        }
    });

    try {
        new Fawn.Task()
            .save('rentals', rental)
            .update('movies', { _id: movie._id} , { $inc: {numberInStock: -1}})
            .run();
        res.send(rental);
    }
    catch (err) {
        res.status(500).send('Something failed');
    }
    res.send(rental);
});

module.exports = router;