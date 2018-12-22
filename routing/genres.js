const express = require('express');
const router = express.Router();
const Joi = require('joi'); // for validating js objects on post requests

const genres = [
    { id: 1, genreName: 'Action' },
    { id: 2, genreName: 'Thriller' },
    { id: 3, genreName: 'Comedy' },
    { id: 4, genreName: 'Drama' },
    { id: 5, genreName: 'Horror' },
    { id: 6, genreName: 'Documentary' }
  ];

// Getting all genres
router.get('', (req, res) => {
  const genresNames = genres.map(genreObj => genreObj.genreName);
  res.send(genresNames);
});
// Getting a specific genre
router.get('/:id', (req, res) => {
  const genre = genres.find(genre => genre.id === parseInt(req.params.id));
  // Checking if a valid id was requested
  if (!genre) {
    return res.status(404).send('There is no genre with such id');
  }
  res.send(genre);
});
// Adding a new genre
router.post('', (req, res) => {
  // Validating the payload
  const genreSchema = {
    name: Joi.string()
      .min(3)
      .max(20)
      .required()
  };
  const genreValidated = Joi.validate(req.body, genreSchema);
  if (genreValidated.error) {
    return res.status(400).send(genreValidated.error.details[0].message);
  }
  // Adding a new genre
  const newGenreId = genres.length + 1;
  const newGenre = {
    id: newGenreId,
    genreName: req.body.name
  };
  genres.push(newGenre);
  res.send(newGenre);
});
// Updating a genre
router.put('/:id', (req, res) => {
  const genre = genres.find(genre => genre.id === parseInt(req.params.id));
  // Checking if a valid id was requested
  if (!genre) {
    return res.status(404).send('There is no genre with such id');
  }
  // Validating the payload
  const genreSchema = {
    name: Joi.string()
      .min(3)
      .max(20)
      .required()
  };
  const genreValidated = Joi.validate(req.body, genreSchema);
  if (genreValidated.error) {
    return res.status(400).send(genreValidated.error.details[0].message);
  }
  const genreIndex = genres.indexOf(genre);
  genres[genreIndex].genreName = req.body.name;
  res.send(genres[genreIndex]);
});
// Deleting a genre
router.delete('/:id', (req, res) => {
  const genre = genres.find(genre => genre.id === parseInt(req.params.id));
  // Checking if a valid id was requested
  if (!genre) {
    return res.status(404).send('There is no genre with such id');
  }
  const genreIndex = genres.indexOf(genre);
  genres.splice(genreIndex, 1);
  res.send(genre);
});

module.exports = router;
