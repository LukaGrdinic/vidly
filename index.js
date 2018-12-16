const express = require('express');
const app = express();

const Joi = require('joi'); // for validating js objects

const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

