const { Schema, model } = require('mongoose');

const Image = new Schema(
  {
    name: String,
    desc: String,
    img: {
      data: Buffer,
      contentType: String,
    },
  },
  { collection: 'images' },
);

module.exports = model('Image', Image);
