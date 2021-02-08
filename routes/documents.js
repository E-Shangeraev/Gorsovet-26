const { Router } = require('express');
const router = Router();

router.get('/', (req, res) => {
  res.render('documents', {
    title: 'Документы',
    isDocuments: true,
  });
});

module.exports = router;
