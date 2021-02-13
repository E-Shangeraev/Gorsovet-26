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
  views: {
    type: Number,
  },
});

module.exports = model('News', News);
