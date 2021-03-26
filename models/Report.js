const { Schema, model, Types } = require('mongoose');

const Report = new Schema(
  {
    img: String,
    video: {
      type: String,
      default: 'Видео отсутствует',
    },
    ownerId: {
      type: Types.ObjectId,
      ref: 'Admin',
    },
  },
  { collection: 'report' },
);

module.exports = model('Report', Report);
