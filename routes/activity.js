const { Router } = require('express');
const router = Router();

router.get('/', (req, res) => {
  res.render('activity', {
    title: 'Деятельность совета',
    isActivity: true,
  });
});

module.exports = router;
