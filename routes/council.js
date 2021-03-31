const { Router } = require('express');
const router = Router();

router.get('/', (req, res) => {
  res.render('council', {
    title: 'Совет депутатов',
    isCouncil: true,
  });
});

module.exports = router;
