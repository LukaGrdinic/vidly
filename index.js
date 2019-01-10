const config = require('config');
require('express-async-errors');
const winston = require('winston');
require('winston-mongodb');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const genresRouter = require('./routing/genres');
const customersRouter = require('./routing/customers');
const moviesRouter = require('./routing/movies');
const rentalsRouter = require('./routing/rentals');
const usersRouter = require('./routing/users');
const auth = require('./routing/auth');
const error = require('./middleware/error');

process.on('uncaughtException', ex => {
  console.log('WE GOT AN UNCAUGHT EXCEPTION');
  winston.log('error', ex.message); // This does not log unhandled exceptions in logfile.log
  process.exit(1);
});
process.on('unhandledRejection', ex => {
  console.log('WE GOT AN UNHANDLED REJECTION');
  winston.log('error', ex.message);
  process.exit(1); // This does not allow the logs to be written in logfile.log
});

winston.handleExceptions(new winston.transports.File({ filename: 'uncaughtExceptions.log' }));

/* if (!config.get('jwtPrivateKey')) {
  console.error('FATAL ERROR: jwtPrivateKey is not defined');
  process.exit(1);
} */

winston.add(
  new winston.transports.File({
    filename: 'logfile.log',
    handleExceptions: true
  })
); // This does not work, cant start the app
/* winston.add(winston.transports.MongoDB, {db: 'mongodb://localhost/vidly'} ); */

/* throw new Error('Something failed during startup'); */
const p = Promise.reject(new Error('Something failed miserably!'));
p.then(() => {
  console.log('Done');
});
const db = mongoose
  .connect('mongodb://localhost/vidly')
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch(() => {
    console.log('Could not connect to MongoDB...');
  });

app.use(express.json()); // This should work instead of bodyParser
app.use('/api/genres', genresRouter);
app.use('/api/customers', customersRouter);
app.use('/api/movies', moviesRouter);
app.use('/api/rentals', rentalsRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', auth);

app.use(error);

app.get('/', (req, res) => {
  res.send('Hello User!');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
