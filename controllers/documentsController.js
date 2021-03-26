const DocumentSession = require('../models/DocumentSession');
const DocumentReport = require('../models/DocumentReport');
const DocumentBase = require('../models/DocumentBase');
const path = require('path');
const fs = require('fs');
const textract = require('textract');
// const mammoth = require('mammoth');
const WordExtractor = require('word-extractor');
// const utf8 = require('utf8');
var iconv = require('iconv-lite');
// var windows1252 = require('windows-1252');

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

function searchByText(res, directorie, inputValue) {
  const regExp = new RegExp(inputValue, 'gi');

  let results = [];
  let fileArray = [];

  const directories = fs.readdirSync(
    path.join(__dirname, `../public/uploads/documents/${directorie}`),
  );

  directories.forEach((dir) => {
    const files = fs.readdirSync(
      path.join(__dirname, `../public/uploads/documents/${directorie}/`, dir),
    );

    fileArray = files.map(async (f) =>
      path.join(__dirname, `../public/uploads/documents/${directorie}/${dir}`, f),
    );
  });

  console.log(fileArray);

  // processArray(files)

  async function extracting(filePath) {
    const ext = path.extname(filePath);

    if (ext === '.doc' || ext === '.docx') {
      const extractor = new WordExtractor();
      const extracted = extractor.extract(filePath);

      await extracted.then((doc) => {
        const text = doc.getBody();
        if (text.match(regExp)) {
          console.log('Совпадает в файле:', filePath);

          results.push(filePath);
        }
      });
    }
    if (ext === '.pdf' || ext === '.txt') {
      textract.fromFileWithPath(filePath, (err, text) => {
        if (err) throw err;

        if (text.match(regExp)) {
          return filePath;
        }
      });
    }
  }

  async function processArray(array) {
    for (const item of array) {
      await extracting(item);
    }
  }

  console.log(results);
}

function searchByFilename(directorie, inputValue) {
  const regExp = new RegExp(inputValue, 'gi');
  let array = [];

  const directories = fs.readdirSync(
    path.join(__dirname, `../public/uploads/documents/${directorie}`),
  );
  directories.forEach((dir) => {
    const files = fs.readdirSync(
      path.join(__dirname, `../public/uploads/documents/${directorie}/`, dir),
    );

    console.log(files);

    files.forEach((file) => {
      const fileName = file.split('.')[0];
      console.log(fileName);
      console.log(regExp);

      if (fileName.match(regExp)) {
        const filePath = path.join(`/public/uploads/documents/${directorie}/${dir}`, file);
        obj = { filePath, name: fileName };
        array.push(obj);
      }
    });
  });

  console.log(array);
  return array;
}

exports.documents = async (req, res) => {
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
};

exports.download = async (req, res) => {
  res.sendFile(path.join(__dirname, '../public/uploads/documents/all/documents.zip'));
};

exports.search = async (req, res) => {
  // const documents = searchByText(res, 'sessions', req.body.request);
  const documents = searchByFilename('sessions', req.body.request);

  // const buffer = fs.readFileSync(path.join(__dirname, '../test.doc'));
  // const documents = iconv.encode(iconv.decode(buffer, 'ISO-8859-1'), 'utf8').toString();
  // const documents = buffer.toString('utf8');
  // console.log(documents);
  res.send({ result: documents });
};

exports.file = async (req, res) => {
  console.log(req.query);
  console.log(
    path.join(
      __dirname,
      `../public/uploads/documents/${req.query.cat}/${req.query.dir}/${req.query.file}`,
    ),
  );
  res.sendFile(
    path.join(
      __dirname,
      `../public/uploads/documents/${req.query.cat}/${req.query.dir}/${req.query.file}`,
    ),
  );
};
