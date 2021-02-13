const { Schema, model } = require('mongoose');

const Calendar = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    url: String,
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: 'calendar' },
);

module.exports = model('Calendar', Calendar);
