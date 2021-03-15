const { Schema, model, Types } = require('mongoose');

const DocumentReport = new Schema(
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
  { collection: 'documents_reports' },
);

// Deputie.index({ address: 'text' }, { default_language: 'russian' });

module.exports = model('DocumentReport', DocumentReport);
