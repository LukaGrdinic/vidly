const mongoose = require('mongoose');
const express = require('express');
const app = express();
const genresRouter = require('./routing/genres');
const customersRouter = require('./routing/customers');

const db = mongoose.connect('mongodb://localhost/vidly')
  .then(() => {console.log('Connected to MongoDB!'); })
  .catch(() => {console.log('Could not connect to MongoDB...');});

app.use(express.json()); // This should work instead of bodyParser
app.use('/api/genres', genresRouter);
app.use('/api/customers', customersRouter);

app.get('/', (req, res) => {
  res.send('Hello User!');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
