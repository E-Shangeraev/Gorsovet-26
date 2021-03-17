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
    title: 'Деятельность совета',
    article,
    activities,
    isActivity: true,
  });
});

router.post('/', async (req, res) => {
  if (req.body.action == 'search') {
    let params = {};
    const textArray = req.body.request.split(' ');
    let textKey = '';
    textArray.forEach((text, index) => {
      if (index == 0) {
        textKey = '"' + text + '"';
      } else {
        textKey += ' ' + '"' + text + '"';
      }
    });
    params.$text = { $search: textKey };

    let inputValue = req.body.request
      .replace(/ул. /g, '')
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
      .replace(/\s{2,}/g, ' ');

    const regMarks = '([., /#!$%^&*;:{}=-_`~()]+)?';
    inputValue = inputValue.split(' ').join(regMarks) + '$';
    const reg = new RegExp(inputValue, 'gi');
    console.log(reg);

    await Deputie.find(params, (err, deputie) => {
      deputie.forEach((deput) => {
        let a = deput.address
          .map((addr) => {
            if (addr.match(reg)) {
              return addr;
            }
          })
          .filter((addr) => addr);
        deput.address = a;
      });
      res.send({ result: deputie });
    }).sort({ score: { $meta: 'textScore' } });
  }
});

router.post('/search', async (req, res) => {
  await Deputie.find({ _id: req.body.request }, (err, deputie) => {
    res.send({ result: deputie });
  });
});

module.exports = router;
