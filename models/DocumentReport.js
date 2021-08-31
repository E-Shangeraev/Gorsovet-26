const { Schema, model, Types } = require('mongoose')

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
  { collection: 'documents_reports' }
)

DocumentReport.index(
  { name: 'text', category: 'text' },
  { default_language: 'russian' }
)

module.exports = model('DocumentReport', DocumentReport)
