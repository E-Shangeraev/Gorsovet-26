const { Router } = require('express');
const router = Router();

router.get('/', (req, res) => {
  res.render('corpus', {
    title: 'Депутатский корпус',
    isCorpus: true,
  });
});

module.exports = router;
