const { Router } = require('express');
const Comission = require('../models/Comission');
const router = Router();
const path = require('path');
const fs = require('fs');

const getDocuments = (model, directorie) => {
  let array = [];

  const directories = fs.readdirSync(
    path.join(__dirname, `../public/uploads/council/${directorie}`),
  );
  directories.forEach((dir) => {
    let obj = {};
    obj.dir = dir;

    const files = fs.readdirSync(
      path.join(__dirname, `../public/uploads/council/${directorie}/`, dir),
    );

    obj.documents = files.map((file) => ({ file, dir, name: file.split('.')[0] }));
    array.push(obj);
  });

  removeUnavailableDocs(model, directorie);

  return array;
};

async function removeUnavailableDocs(model, directorie) {
  const documents = await model.find().sort({ _id: -1 }).lean();
  const directories = fs.readdirSync(
    path.join(__dirname, `../public/uploads/council/${directorie}`),
  );
  const searchArr = documents.map((item) => item.title);

  directories.forEach((dir) => {
    if (searchArr.indexOf(dir) == -1) {
      deleteFolderRecursive(path.join(__dirname, `../public/uploads/council/${directorie}/${dir}`));
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

router.get('/', (req, res) => {
  const comissions = getDocuments(Comission, 'comissions');

  res.render('council', {
    title: 'Совет депутатов',
    isCouncil: true,
    comissions,
  });
});

module.exports = router;
