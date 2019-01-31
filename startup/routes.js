const express = require('express');
const genresRouter = require('../routing/genres');
const customersRouter = require('../routing/customers');
const moviesRouter = require('../routing/movies');
const rentalsRouter = require('../routing/rentals');
const usersRouter = require('../routing/users');
const auth = require('../routing/auth');
const returns = require('../routing/returns');
const error = require('../middleware/error');

module.exports = function(app) {
  app.use(express.json()); // This should work instead of bodyParser
  app.use('/api/genres', genresRouter);
  app.use('/api/customers', customersRouter);
  app.use('/api/movies', moviesRouter);
  app.use('/api/rentals', rentalsRouter);
  app.use('/api/users', usersRouter);
  app.use('/api/auth', auth);
  app.use('/api/returns', returns);

  app.use(error);
};
