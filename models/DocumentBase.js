const { Schema, model, Types } = require('mongoose');

const DocumentBase = new Schema(
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
  { collection: 'documents_base' },
);

// Deputie.index({ address: 'text' }, { default_language: 'russian' });

module.exports = model('DocumentBase', DocumentBase);
