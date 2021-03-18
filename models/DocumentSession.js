const { Schema, model, Types } = require('mongoose');

const DocumentSession = new Schema(
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
  { collection: 'documents_sessions' },
);

module.exports = model('DocumentSession', DocumentSession);
