const winston = require('winston');
const express = require('express');
const app = express();

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();


const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  winston.info(`Running in ${process.env.NODE_ENV} mode...`);
  winston.info(`App is listening on port ${port}`);
});

module.exports = server;
