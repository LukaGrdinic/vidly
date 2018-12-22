const express = require('express');
const app = express();
const genresRouter = require('./routing/genres');

app.use(express.json()); // This should work instead of bodyParser
app.use('/api/genres', genresRouter);

app.get('/', (req, res) => {
  res.send('Hello User!');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
