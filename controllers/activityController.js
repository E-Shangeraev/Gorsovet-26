const ActivityWork = require('../models/ActivityWork');
const ActivityHearing = require('../models/ActivityHearing');
const ActivitySession = require('../models/ActivitySession');
const path = require('path');
const fs = require('fs');

const getDocuments = (model, directorie) => {
  let array = [];

  const directories = fs.readdirSync(
    path.join(__dirname, `../public/uploads/activity/${directorie}`),
  );
  directories.forEach((dir) => {
    let obj = {};
    obj.dir = dir;

    const files = fs.readdirSync(
      path.join(__dirname, `../public/uploads/activity/${directorie}/`, dir),
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
    path.join(__dirname, `../public/uploads/activity/${directorie}`),
  );
  const searchArr = documents.map((item) => item.title);

  directories.forEach((dir) => {
    if (searchArr.indexOf(dir) == -1) {
      deleteFolderRecursive(
        path.join(__dirname, `../public/uploads/activity/${directorie}/${dir}`),
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

exports.documents = (req, res) => {
  const activityWork = getDocuments(ActivityWork, 'work');
  const activityHearing = getDocuments(ActivityHearing, 'hearings');
  const activitySession = getDocuments(ActivitySession, 'sessions');

  res.render('activity', {
    title: 'Деятельность совета',
    isActivity: true,
    work: activityWork,
    hearing: activityHearing,
    session: activitySession,
  });
};
