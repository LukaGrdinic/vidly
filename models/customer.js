const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    customerName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 20,
      trim: true
    },
    isGold: {
      type: Boolean,
      default: false
    },
    phone: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 20,
      trim: true
    }
  });

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;