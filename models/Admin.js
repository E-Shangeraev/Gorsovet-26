const { Schema, model } = require('mongoose');

const Admin = new Schema(
  {
    login: {
      type: String,
      required: true,
    },
    encryptedPassword: {
      type: String,
      required: true,
    },
  },
  { collection: 'admin' },
);

module.exports = model('Admin', Admin);
