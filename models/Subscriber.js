const { Schema, model, Types } = require('mongoose');

const Subscriber = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    status: {
      type: Number,
      default: 0,
    },
    ownerId: {
      type: Types.ObjectId,
      ref: 'Admin',
    },
  },
  { collection: 'subscribers' },
);

module.exports = model('Subscriber', Subscriber);
