const { Schema, model, Types } = require('mongoose');

const Report = new Schema(
  {
    img: String,
    ownerId: {
      type: Types.ObjectId,
      ref: 'Admin',
    },
  },
  { collection: 'report' },
);

module.exports = model('Report', Report);
