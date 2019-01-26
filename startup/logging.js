const winston = require('winston');
// require('winston-mongodb');
require('express-async-errors');

module.exports = function() {
  winston.handleExceptions(
    new winston.transports.Console({ colorize: true, prettyPrint: true }), // not sure if colorize and prettyPring are deprecated
    new winston.transports.File({ filename: 'uncaughtExceptions.log' })
  );

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

  winston.add(
    new winston.transports.File({
      filename: 'logfile.log',
      handleExceptions: true
    })
  ); // This does not work, cant start the app
  /* winston.add(winston.transports.MongoDB, {db: 'mongodb://localhost/vidly'} ); */
};
