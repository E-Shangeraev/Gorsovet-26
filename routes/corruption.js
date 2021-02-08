const { Router } = require('express');
const router = Router();

router.get('/', (req, res) => {
  res.render('corruption', {
    title: 'Противодействие коррупции',
  });
});

module.exports = router;
