const { Schema, model } = require('mongoose')

const CardsBlockSchema = new Schema({
  index: { type: Number, required: true, unique: true },
  title: {
    type: String,
    required: true,
  },
})

module.exports = model('CardsBlock', CardsBlockSchema)
