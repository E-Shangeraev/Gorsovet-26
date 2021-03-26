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
    img: {
      type: String,
    },
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

News.index({ text: 'text' }, { default_language: 'russian' });

module.exports = model('News', News);
