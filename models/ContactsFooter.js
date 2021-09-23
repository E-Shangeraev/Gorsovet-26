const { Schema, model } = require('mongoose')

const ContactsFooterSchema = new Schema({
  phoneNumber: {
    type: String,
    required: true,
  },
  fax: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
})

module.exports = model('ContactsFooter', ContactsFooterSchema)
