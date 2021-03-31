const { Schema, model, Types } = require('mongoose');

const ActivityWork = new Schema(
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
  { collection: 'activity_work' },
);

module.exports = model('ActivityWork', ActivityWork);
