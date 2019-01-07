const bcrypt = require("bcrypt");
const Joi = require('joi');

const _ = require('lodash');
const { User } = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  // Validating the payload
  const { error } = validate(req.body);
  if (error) { return res.status(400).send(error.details[0].message); }

  let user = await User.findOne({email: req.body.email});
  if (!user) {
    return res.status(400).send('Invalid Email or Password');
  }
  
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
      return  res.status(400).send('Invalid Email or Password');
  }

  const token = user.generateAuthToken();
  res.send(token);
});

function validate(request) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(1024).required()
    }
    return Joi.validate(request, schema);
}

module.exports = router;
