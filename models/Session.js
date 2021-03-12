const { Schema, model, Types } = require('mongoose');

const Session = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    file: String,
    category: {
      type: String,
      required: true,
    },
    ownerId: {
      type: Types.ObjectId,
      ref: 'Admin',
    },
  },
  { collection: 'documents' },
);

// Deputie.index({ address: 'text' }, { default_language: 'russian' });

module.exports = model('Session', Session);
