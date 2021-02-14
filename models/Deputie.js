const { Schema, model } = require('mongoose');

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
    about: {
      type: String,
      required: false,
    },
  },
  { collection: 'deputies' },
);

module.exports = model('Deputie', Deputie);
