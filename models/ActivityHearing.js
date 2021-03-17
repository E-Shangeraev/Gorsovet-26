const { Schema, model, Types } = require('mongoose');

const ActivityHearing = new Schema(
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
  { collection: 'activity_hearing' },
);

module.exports = model('ActivityHearing', ActivityHearing);
