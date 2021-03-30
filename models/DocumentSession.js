const { Schema, model, Types } = require('mongoose');

const DocumentSession = new Schema(
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
  { collection: 'documents_sessions' },
);

module.exports = model('DocumentSession', DocumentSession);
