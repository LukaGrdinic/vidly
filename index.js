const winston = require('winston');
const express = require('express');
const app = express();
const config = require('config');

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
/* require('./startup/config')(); */

/* const p = Promise.reject(new Error('Something failed miserably!'));
p.then(() => {
  console.log('Done');
}); */

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  winston.info(`Running in ${process.env.NODE_ENV} mode...`);
  winston.info(`App is listening on port ${port}`);
});

module.exports = server;
