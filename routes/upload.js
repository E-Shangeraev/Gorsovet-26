const { Router } = require('express');
const Image = require('../models/Image');
const fs = require('fs');
const path = require('path');
const router = Router();

const img = fs.readFile(path.join(__dirname, '../public/img/activities-1.jpg'), (err, data) => {
  if (err) throw err;

  console.log(img);

  // const encodeImg = img.toString('base64');
  // console.log(encodeImg);
});

router.post('/image', (req, res));

// upload.single('image'), (req, res) => {
//   const img = fs.readFile(path.join(__dirname, '/public/img/activities-1.jpg'));
//   const encodeImg = img.toString('base64');

//   // const image = new Image
// }

module.exports = router;
