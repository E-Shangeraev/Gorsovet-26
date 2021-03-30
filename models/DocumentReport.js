const { Schema, model, Types } = require('mongoose');

const DocumentReport = new Schema(
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
  { collection: 'documents_reports' },
);

// Deputie.index({ address: 'text' }, { default_language: 'russian' });

module.exports = model('DocumentReport', DocumentReport);
