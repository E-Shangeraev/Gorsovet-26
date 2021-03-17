const { Schema, model, Types } = require('mongoose');

const Comission = new Schema(
  {
    name: String,
    title: String,
    files: {
      type: String,
      required: true,
    },
    ownerId: {
      type: Types.ObjectId,
      ref: 'Admin',
    },
  },
  { collection: 'comissions' },
);

module.exports = model('Comission', Comission);
