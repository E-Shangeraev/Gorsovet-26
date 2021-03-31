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

const getDocuments = async (req, res, model, title) => {
  const documents = await model.find({ year: req.query.y, month: req.query.m }).lean();
  const availableYears = await model.find().distinct('year').lean();

  res.render('documents-folder', {
    title,
    isDocuments: true,
    documents,
    availableYears,
    m: req.query.m,
    y: req.query.y,
  });

  // removeUnavailableDocs(model, directorie);
};

async function removeUnavailableDocs(model, directorie) {
  const documents = await model.find().lean();
  // Документы локально
  const files = fs.readdirSync(path.join(__dirname, `../public/uploads/documents/${directorie}`));
  // Документы в базе данных
  const searchArr = documents.map((item) => item.fileName);

  // console.log('searchArr', searchArr);

  files.forEach((f) => {
    if (searchArr.indexOf(f) == -1) {
      const curPath = path.join(__dirname, `../public/uploads/documents/${directorie}/${f}`);
      fs.unlinkSync(curPath);
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

  // console.log(fileArray);

  // processArray(files)

  async function extracting(filePath) {
    const ext = path.extname(filePath);

    if (ext === '.doc' || ext === '.docx') {
      const extractor = new WordExtractor();
      const extracted = extractor.extract(filePath);

      await extracted.then((doc) => {
        const text = doc.getBody();
        if (text.match(regExp)) {
          // console.log('Совпадает в файле:', filePath);

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

  // console.log(results);
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

    // console.log(files);

    files.forEach((file) => {
      const fileName = file.split('.')[0];
      // console.log(fileName);
      // console.log(regExp);

      if (fileName.match(regExp)) {
        const filePath = path.join(`/public/uploads/documents/${directorie}/${dir}`, file);
        obj = { filePath, name: fileName };
        array.push(obj);
      }
    });
  });

  // console.log(array);
  return array;
}

exports.documents = async (req, res) => {
  const sessions = await DocumentSession.findOne().sort({ year: -1, month: -1 }).lean();
  const reports = await DocumentReport.findOne().sort({ year: -1, month: -1 }).lean();
  const base = await DocumentBase.findOne().sort({ year: -1, month: -1 }).lean();

  res.render('documents', {
    title: 'Документы',
    isDocuments: true,
    sessions,
    reports,
    base,
  });
};

exports.sessions = (req, res) => getDocuments(req, res, DocumentSession, 'Решения сессии');
// const documents = await DocumentSession.find({ year: req.query.y, month: req.query.m }).lean();
// const availableYears = await DocumentReport.find().distinct('year').lean();

// res.render('documents-folder', {
//   title: 'Решения сессии',
//   isDocuments: true,
//   documents,
//   availableYears,
//   m: req.query.m,
//   y: req.query.y,
// });
// };

exports.reports = (req, res) => getDocuments(req, res, DocumentReport, 'Отчёты о деятельности');

exports.base = (req, res) => getDocuments(req, res, DocumentBase, 'Нормативная правовая база');

exports.download = async (req, res) => {
  const zipFile = `${req.params.category}.zip`;
  res.sendFile(path.join(__dirname, '../public/uploads/documents/archives', zipFile));
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
  // console.log(req.query);
  // console.log(
  //   path.join(
  //     __dirname,
  //     `../public/uploads/documents/${req.query.cat}/${req.query.dir}/${req.query.file}`,
  //   ),
  // );
  res.sendFile(
    path.join(
      __dirname,
      `../public/uploads/documents/${req.query.cat}/${req.query.dir}/${req.query.file}`,
    ),
  );
};
