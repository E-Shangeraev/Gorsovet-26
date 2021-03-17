const { Router } = require('express');
const DocumentSession = require('../models/DocumentSession');
const DocumentReport = require('../models/DocumentReport');
const DocumentBase = require('../models/DocumentBase');
const router = Router();
const path = require('path');
const fs = require('fs');

const getDocuments = (model, directorie) => {
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

  removeUnavailableDocs(model, directorie);

  return array;
};

async function removeUnavailableDocs(model, directorie) {
  const documents = await model.find().lean();
  const directories = fs.readdirSync(
    path.join(__dirname, `../public/uploads/documents/${directorie}`),
  );
  const searchArr = documents.map((item) => item.title);
  // console.log(`Документы в базе данных ${directorie}:`, searchArr);
  // console.log('Локально', directories);

  directories.forEach((dir) => {
    if (searchArr.indexOf(dir) == -1) {
      deleteFolderRecursive(
        path.join(__dirname, `../public/uploads/documents/${directorie}/${dir}`),
      );
    }
  });
}

function deleteFolderRecursive(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file) {
      const curPath = path + '/' + file;
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}

router.get('/', async (req, res) => {
  const documentSessions = getDocuments(DocumentSession, 'sessions');
  const documentReports = getDocuments(DocumentReport, 'reports');
  const documentBases = getDocuments(DocumentBase, 'base');

  res.render('documents', {
    title: 'Документы',
    isDocuments: true,
    reports: documentReports,
    sessions: documentSessions,
    base: documentBases,
  });
});

router.get('/download', async (req, res) => {
  res.sendFile(path.join(__dirname, '../public/uploads/documents/all/documents.zip'));
});

module.exports = router;
