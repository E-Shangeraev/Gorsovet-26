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

router.post('/', async (req, res) => {
  if (req.body.action == 'search') {
    //   console.log(req.body);
    //   let params = {};
    //   const textArray = req.body.request.split(' ');
    //   let textKey = '';
    //   textArray.forEach((text, index) => {
    //     if (index == 0) {
    //       textKey = '"' + text + '"';
    //     } else {
    //       textKey += ' ' + '"' + text + '"';
    //     }
    //   });

    //   params.$text = { $search: textKey };

    let params = {};
    let textKey = req.body.request;
    params.$text = { $search: textKey };

    await Deputie.find(params, (err, deputie) => {
      // console.log(deputie);
      res.send({ result: deputie });
    });
  }
});

router.post('/search', async (req, res) => {
  console.log(req.body);
  await Deputie.find(
    { $text: { $search: req.body.request } },
    { score: { $meta: 'textScore' } },
    (err, deputie) => {
      res.send({ result: deputie });
    },
  ).sort({ score: { $meta: 'textScore' } });
  // console.log(search);
});

module.exports = router;
