const { Schema, model } = require('mongoose');

const Activity = new Schema(
  {
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
  },
  { collection: 'activities' },
);

module.exports = model('Activity', Activity);
