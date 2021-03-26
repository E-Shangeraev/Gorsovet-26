const { Schema, model, Types } = require('mongoose');

const Deputie = new Schema(
  {
    id: {
      type: Number,
    },
    name: {
      type: String,
      required: true,
    },
    img: String,
    post: {
      type: String,
      required: false,
    },
    schedule: {
      type: String,
      required: false,
    },
    appointment: {
      type: String,
      required: false,
    },
    about: {
      type: String,
      required: false,
    },
    fraction: {
      type: String,
      required: false,
    },
    address: {
      type: Array,
      required: false,
    },
    ownerId: {
      type: Types.ObjectId,
      ref: 'Admin',
    },
  },
  { collection: 'deputies' },
);

Deputie.index({ address: 'text' }, { default_language: 'russian' });

module.exports = model('Deputie', Deputie);
