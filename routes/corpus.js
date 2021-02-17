const { Router } = require('express');
const Deputie = require('../models/Deputie');
const Activity = require('../models/Activity');
const router = Router();
router.get('/', async (req, res) => {
  const deputies = await Deputie.find().lean();
  const activities = await Activity.find().lean();

  res.render('corpus', {
    title: 'Депутатский корпус',
    isCorpus: true,
    deputies,
    activities,
  });
});

router.get('/:id', async (req, res) => {
  const article = await Activity.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }).lean();
  const activities = await Activity.find({
    _id: { $ne: article['_id'] },
  })
    .sort({ _id: 1 })
    .limit(4)
    .lean();

  res.render('article', {
    title: 'Новости',
    article,
    activities,
  });
});

module.exports = router;
