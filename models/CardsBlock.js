const { Schema, model, Types } = require('mongoose')

const CardsBlockSchema = new Schema(
  {
    index: { type: Number, required: true, unique: true },
    title: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

CardsBlockSchema.virtual('cards', {
  ref: 'Cards',
  localField: '_id',
  foreignField: 'uploadedFile',
})

module.exports = model('CardsBlock', CardsBlockSchema)
