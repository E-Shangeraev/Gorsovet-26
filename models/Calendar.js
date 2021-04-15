const { Schema, model, Types } = require('mongoose');

const Calendar = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    filePath: String,
    fileName: String,
    date: {
      type: Date,
      default: Date.now() - 4,
    },
    ownerId: {
      type: Types.ObjectId,
      ref: 'Admin',
    },
  },
  { collection: 'calendar' },
);

module.exports = model('Calendar', Calendar);
