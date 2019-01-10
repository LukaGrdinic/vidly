const winston = require('winston');
const express = require('express');
const app = express();

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
/* require('./startup/config')(); */

/* const p = Promise.reject(new Error('Something failed miserably!'));
p.then(() => {
  console.log('Done');
}); */

const port = process.env.PORT || 3000;

app.listen(port, () => {
  winston.info(`App is listening on port ${port}`);
});
