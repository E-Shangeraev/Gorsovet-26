const { Schema, model, Types } = require('mongoose');

const ActivityHearing = new Schema(
  {
    year: Number,
    month: String,
    name: String,
    filePath: String,
    fileName: String,
    category: String,
    ownerId: {
      type: Types.ObjectId,
      ref: 'Admin',
    },
  },
  { collection: 'activity_hearing' },
);

module.exports = model('ActivityHearing', ActivityHearing);
