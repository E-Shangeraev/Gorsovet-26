const DocumentSession = require('../models/DocumentSession');
const DocumentReport = require('../models/DocumentReport');
const DocumentBase = require('../models/DocumentBase');
const path = require('path');
const fs = require('fs');
const textract = require('textract');

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
  // Документы локально
  const directories = fs.readdirSync(
    path.join(__dirname, `../public/uploads/documents/${directorie}`),
  );
  // Документы в базе данных
  const searchArr = documents.map((item) => item.title);

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

function searchByText(directorie) {
  const directories = fs.readdirSync(
    path.join(__dirname, `../public/uploads/documents/${directorie}`),
  );
  directories.forEach((dir) => {
    const files = fs.readdirSync(
      path.join(__dirname, `../public/uploads/documents/${directorie}/`, dir),
    );
    // console.log(files);
    files.forEach((f) => {
      console.log(f);
      const filePath = path.join(__dirname, `../public/uploads/documents/${directorie}/${dir}`, f);

      fs.readFile(filePath, (err, data) => {
        if (err) {
          throw err;
        }
        console.log(data.toString('utf-8'));
      });
    });
  });
}

exports.documents = async (req, res) => {
  const documentSessions = getDocuments(DocumentSession, 'sessions');
  const documentReports = getDocuments(DocumentReport, 'reports');
  const documentBases = getDocuments(DocumentBase, 'base');

  // searchByText('sessions');

  res.render('documents', {
    title: 'Документы',
    isDocuments: true,
    reports: documentReports,
    sessions: documentSessions,
    base: documentBases,
  });
};

exports.download = async (req, res) => {
  res.sendFile(path.join(__dirname, '../public/uploads/documents/all/documents.zip'));
};

exports.autoFillbar = async (req, res) => {
  if (req.body.action == 'search') {
    let params = {};
    const textArray = req.body.request.split(' ');
    let textKey = '';
    textArray.forEach((text, index) => {
      if (index == 0) {
        textKey = '"' + text + '"';
      } else {
        textKey += ' ' + '"' + text + '"';
      }
    });
    params.$text = { $search: textKey };

    let inputValue = req.body.request
      .replace(/ул. /g, '')
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
      .replace(/\s{2,}/g, ' ');

    const regMarks = '([., /#!$%^&*;:{}=-_`~()]+)?';
    inputValue = inputValue.split(' ').join(regMarks) + '$';
    const reg = new RegExp(inputValue, 'gi');
    console.log(reg);

    await Deputie.find(params, (err, deputie) => {
      deputie.forEach((deput) => {
        let a = deput.address
          .map((addr) => {
            if (addr.match(reg)) {
              return addr;
            }
          })
          .filter((addr) => addr);
        deput.address = a;
      });
      res.send({ result: deputie });
    }).sort({ score: { $meta: 'textScore' } });
  }
};

exports.search = async (req, res) => {
  await Deputie.find({ _id: req.body.request }, (err, deputie) => {
    res.send({ result: deputie });
  });
};
