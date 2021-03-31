const { Schema, model, Types } = require('mongoose');

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
      default: 0,
    },
    ownerId: {
      type: Types.ObjectId,
      ref: 'Admin',
    },
  },
  { collection: 'activities' },
);

module.exports = model('Activity', Activity);
