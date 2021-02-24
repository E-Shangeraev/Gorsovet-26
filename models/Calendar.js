const { Schema, model, Types } = require('mongoose');

const Calendar = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    img: String,
    url: String,
    date: {
      type: Date,
      default: Date.now,
    },
    ownerId: {
      type: Types.ObjectId,
      ref: 'Admin',
    },
  },
  { collection: 'calendar' },
);

module.exports = model('Calendar', Calendar);
