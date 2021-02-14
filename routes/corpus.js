const { Router } = require('express');
const Deputie = require('../models/Deputie');
const router = Router();

router.get('/', async (req, res) => {
  const deputies = await Deputie.find().lean();

  res.render('corpus', {
    title: 'Депутатский корпус',
    isCorpus: true,
    deputies,
  });
});

module.exports = router;
