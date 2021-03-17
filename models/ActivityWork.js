const { Schema, model, Types } = require('mongoose');

const ActivityWork = new Schema(
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
  { collection: 'activity_work' },
);

module.exports = model('ActivityWork', ActivityWork);
