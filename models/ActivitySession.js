const { Schema, model, Types } = require('mongoose');

const ActivitySession = new Schema(
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
  { collection: 'activity_session' },
);

module.exports = model('ActivitySession', ActivitySession);
