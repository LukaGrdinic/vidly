const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Joi = require('joi'); // for validating js objects on post requests
const { Movie } = require('../models/movie');
const { Genre } = require('../models/genre');

// GETTING ALL MOVIES
router.get('', async (req, res) => {
  const movies = await Movie.find();
  res.send(movies);
});
// GETTING A SPECIFIC MOVIE
router.get('/:id', async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  // return error when no movie
  res.send(movie);
});
// ADDING A NEW MOVIE
router.post('', async (req, res) => {
  const movieShape = {
    title: Joi.string()
      .min(3)
      .max(20)
      .required(),
    genreId: Joi.string().required(),
    numberInStock: Joi.number().min(0).required()
  };
  const { error } = Joi.validate(req.body, movieShape);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) {
    return res.status(404).send('There is no genre with provided Id');
  }
  const movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      genreName: genre.genreName,
    },
    numberInStock: req.body.numberInStock
  });
  const newMovie = await movie.save();
  res.send(newMovie);
});

router.put('/:id', async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  console.log('MOVIE',movie);

  // return error when no movie
  const movieShape = {
    title: Joi.string()
      .min(3)
      .max(20)
      .required(),
    genreId: Joi.string().required()
  };
  const { error } = Joi.validate(req.body, movieShape);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const genre = await Genre.findById(req.body.genreId);
  if (!genre) {
    return res.status(404).send('There is no genre with provided Id');
  }
  movie.set({
    title: req.body.title,
    genre: {
      _id: genre._id,
      genreName: genre.genreName
    }
  });
  const updatedMovie = await movie.save();
  if (!updatedMovie) {
    return res.status(500).send('There was an error saving to database');
  }
  res.send(updatedMovie);
});

router.delete('/:id', async (req, res) => {
    const deletedMovie = await Movie.findByIdAndRemove(req.params.id);
    if (!deletedMovie) {
        return res.status(404).send('The movie with the specified id was not found');
    }
    res.send(deletedMovie);
});

module.exports = router;
