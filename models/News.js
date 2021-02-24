const { Schema, model, Types } = require('mongoose');

const News = new Schema(
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
    date: {
      type: Date,
      default: Date.now,
    },
    views: {
      type: Number,
    },
    ownerId: {
      type: Types.ObjectId,
      ref: 'Admin',
    },
  },
  { collection: 'news' },
);

module.exports = model('News', News);
