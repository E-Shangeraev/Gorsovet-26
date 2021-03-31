const { Schema, model, Types } = require('mongoose');

const ActivitySession = new Schema(
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
  { collection: 'activity_session' },
);

module.exports = model('ActivitySession', ActivitySession);
