const { Schema, model, Types } = require('mongoose')

const CardSchema = new Schema({
  index: { type: Number, required: true, unique: true },
  blockTitle: { type: Types.ObjectId, ref: 'CardsBlock', required: true },
  title: {
    type: String,
    required: true,
  },
  uploadedFile: JSON,
  contacts: [
    {
      to: String,
      phone: String,
    },
  ],
  year: {
    type: String,
    require: false,
  },
})

module.exports = model('Cards', CardSchema)
