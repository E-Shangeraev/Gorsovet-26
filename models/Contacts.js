const { Schema, model } = require('mongoose')

const ContactsSchema = new Schema({
  address: {
    type: String,
    required: true,
  },
  workTime: {
    type: String,
    required: true,
  },
  phoneNumbers: [
    {
      type: String,
      required: true,
    },
  ],
  emails: [
    {
      type: String,
      required: true,
    },
  ],
})

module.exports = model('Contacts', ContactsSchema)
