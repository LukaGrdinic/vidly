const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Joi = require('joi'); // for validating js objects on post requests
const auth = require('../middleware/auth');

const Customer = require('../models/customer');

// GETTING ALL CUSTOMERS
router.get('', async (req, res) => {
  const customers = await Customer.find({})
    .sort('customerName')
    .select('customerName');
  res.send(customers);
});
// GETTING A SPECIFIC CUSTOMER
router.get('/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    res.send(customer);
  } catch (err) {
    console.log('There was an error reading user from the database: \n', err.message);
    return res.send(err.message);
  }
});
// ADDING A NEW CUSTOMER
router.post('', auth, async (req, res) => {
  // Validating the payload
  const customerShape = {
    name: Joi.string()
      .min(3)
      .max(20)
      .required(),
    phone: Joi.string()
      .min(3)
      .max(20)
      .required(),
    isGold: Joi.boolean()
  };
  const customerValidated = Joi.validate(req.body, customerShape);
  if (customerValidated.error) {
    return res.status(400).send(customerValidated.error.details[0].message);
  }
  // If payload is validated
  const newCustomer = new Customer({
    customerName: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold
  });

  const savedGenre = await newCustomer.save();

  res.send(savedGenre);
});
// UPDATING A CUSTOMER
router.put('/:id', auth, async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) {
    // This never returns a response if not handled
    return res.status(404).send('There is no customer with such id');
  }

  // Validating the payload
  const customerShape = {
    name: Joi.string()
      .min(3)
      .max(20)
      .required(),
    phone: Joi.string()
      .min(3)
      .max(20)
      .required(),
    isGold: Joi.boolean()
  }; // Now it only updates if user provides all props
  const customerValidated = Joi.validate(req.body, customerShape);
  if (customerValidated.error) {
    return res.status(400).send(customerValidated.error.details[0].message);
  }
  // If payload is validated
  customer.set({
    customerName: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold
  });
  const updatedCustomer = await customer.save();
  if (!updatedCustomer) {
    return res.status(500).send('There was an error saving to database');
  }
  res.send(updatedCustomer);
});
// DELETING A CUSTOMER
router.delete('/:id', auth, async (req, res) => {
  const result = await Customer.findByIdAndRemove(req.params.id);
  if (!result) {
    return res.status(500).send('There was an error saving to database');
  }
  res.send(result);
});

module.exports = router;
