const { Schema, model, Types } = require('mongoose');

const Deputie = new Schema(
  {
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
    ownerId: {
      type: Types.ObjectId,
      ref: 'Admin',
    },
  },
  { collection: 'deputies' },
);

module.exports = model('Deputie', Deputie);
