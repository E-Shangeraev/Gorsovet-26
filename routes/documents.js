const { Router } = require('express');
const DocumentSession = require('../models/DocumentSession');
const DocumentReport = require('../models/DocumentReport');
const DocumentBase = require('../models/DocumentBase');
const router = Router();
const path = require('path');
const fs = require('fs');

const getDocuments = (directorie) => {
  let array = [];

  const directories = fs.readdirSync(
    path.join(__dirname, `../public/uploads/documents/${directorie}`),
  );
  directories.forEach((dir) => {
    let obj = {};
    obj.dir = dir;

    const files = fs.readdirSync(
      path.join(__dirname, `../public/uploads/documents/${directorie}/`, dir),
    );

    obj.documents = files.map((file) => ({ file, dir, name: file.split('.')[0] }));
    array.push(obj);
  });

  console.log(array);

  return array;
};

router.get('/', async (req, res) => {
  const documentSessions = getDocuments('sessions');
  const documentReports = getDocuments('reports');
  const documentBases = getDocuments('base');

  res.render('documents', {
    title: 'Документы',
    isDocuments: true,
    reports: documentReports,
    sessions: documentSessions,
    base: documentBases,
  });
});

// router.post('/download', async (req, res) => {
//   const param = JSON.parse(req.body.param);
//   console.log(param);
//   const file = path.join(__dirname, '..', param.path);
//   console.log(file);
//   res.download(file);
// });

module.exports = router;
