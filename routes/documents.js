const { Router } = require('express');
const Session = require('../models/Session');
const router = Router();
const fs = require('fs');

router.get('/', async (req, res) => {
  const documents = await Session.find().lean();
  console.log(documents);
  const zip = documents.filter((obj) => obj.category === 'Отчеты о деятельности')[0];
  console.log(zip);
  const files = fs.readFile(zip.file);
  console.log(files);

  res.render('documents', {
    title: 'Документы',
    isDocuments: true,
    reports: documents.filter((obj) => obj.category === 'Отчеты о деятельности'),
    sessions: documents.filter((obj) => obj.category === 'Решения сессии'),
    base: documents.filter((obj) => obj.category === 'Нормативная правовая база'),
  });
});

module.exports = router;
