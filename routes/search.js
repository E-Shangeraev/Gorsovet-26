const { Router } = require('express');
const router = Router();

router.get('/', async (req, res) => {
  res.render('search', {
    title: 'Результаты поиска',
  });
});

module.exports = router;
