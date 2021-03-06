const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Joi = require('joi'); // for validating js objects on post requests
const { Genre } = require('../models/genre');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
/* const asyncMiddleware = require('../middleware/async'); */
// GETTING ALL GENRES
router.get('', async (req, res, next) => {
  /*  throw new Error('Could not get the genres'); */
  const genresNames = await Genre.find({})
    .sort('genreName')
    .select('genreName');
  res.send(genresNames);
});
// GETTING A SPECIFIC GENRE
router.get(
  '/:id',
  validateObjectId,
  /* asyncMiddleware(async (req, res) => { // Using async middleware if there was no express-async-errors module */
  async (req, res) => {
    const genre = await Genre.findById(req.params.id);
    // Checking if a valid id was requested
    if (!genre) {
      return res.status(404).send('There is no genre with such id');
    }
    res.send(genre);
  }
);
// ADDING A NEW GENRE
router.post('', [auth, admin], async (req, res) => {
  // Validating the payload
  const genreShape = {
    name: Joi.string()
      .min(3)
      .max(20)
      .required()
  };
  const genreValidated = Joi.validate(req.body, genreShape);
  if (genreValidated.error) {
    return res.status(400).send(genreValidated.error.details[0].message);
  }
  // If payload is validated
  const newGenre = new Genre({
    genreName: req.body.name
  });

  const savedGenre = await newGenre.save();

  res.send(savedGenre);
});
// UPDATING A GENRE
router.put('/:id', validateObjectId, [auth, admin], async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  // Checking if a valid id was requested
  if (!genre) {
    return res.status(404).send('There is no genre with such id');
  }
  // Validating the payload
  const genreShape = {
    name: Joi.string()
      .min(3)
      .max(20)
      .required()
  };
  const genreValidated = Joi.validate(req.body, genreShape);
  if (genreValidated.error) {
    return res.status(400).send(genreValidated.error.details[0].message);
  }
  // If payload is validated
  genre.set({
    genreName: req.body.name
  });
  const updatedGenre = await genre.save();
  if (!updatedGenre) {
    return res.status(500).send('There was an error saving to database');
  }
  res.send(updatedGenre);
});
// DELETING A GENRE
router.delete('/:id', validateObjectId, [auth, admin], async (req, res) => {
  const result = await Genre.findByIdAndRemove(req.params.id);
  if (!result) {
    return res.status(500).send('There was an error saving to database');
  }
  res.send(result);
});

module.exports = router;
