const { Schema, model } = require('mongoose');

const News = new Schema({
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
    max: 12,
  },
  img: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model('News', News);
