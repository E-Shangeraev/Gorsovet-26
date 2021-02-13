const { Schema, model } = require('mongoose');

const User = new Schema({
  ip: {
    type: String,
    required: true,
  },
});

module.exports = model('User', User);
