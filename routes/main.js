const { Router } = require('express');
const router = Router();

router.get('/', (req, res) => {
  res.render('main', {
    title: 'Главная',
    isMain: true,
  });
});

module.exports = router;
