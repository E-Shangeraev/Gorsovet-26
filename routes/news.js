const { Router } = require('express');
const News = require('../models/News');
const Report = require('../models/Report');
const Subscriber = require('../models/Subscriber');
const router = Router();
const url = require('url');

const changeStream = News.watch().on('change', async (data) => {
  console.log(data.fullDocument);
  const added = data.fullDocument;
  if (added) {
    const news = `
      <h2>Сайт gorsovet-26.ru</h2>
      <hr>
      <h3>${added.title}</h3>
      <p>${added.text}</p>
    `;
    await subscribe('smtp.yandex.ru', 587, subs, 'Подвтердите подписку на новости', news);
  }
});

router.get('/', paginatedResults(News), async (req, res) => {
  const news = res.paginatedResults.results;
  const page = res.paginatedResults.page;
  const pagesCount = res.paginatedResults.pagesCount;
  const pageNums = res.paginatedResults.pageNums;
  const report = await Report.find().lean();

  report.forEach((rep) => {
    if (rep.video) {
      rep.url = rep.video;
      rep.video = rep.video.replace('watch?v=', 'embed/');
    }
  });

  res.render('news', {
    title: 'Новости',
    isNews: true,
    news,
    page,
    pagesCount,
    pageNums,
    next: page + 1,
    isNext: pagesCount > page,
    report,
  });
});

router.get('/:id', async (req, res) => {
  const article = await News.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } })
    .sort({
      views: -1,
    })
    .lean();

  const news = await News.find({
    _id: { $ne: article['_id'] },
  })
    .sort({ _id: 1 })
    .limit(4)
    .lean();

  res.render('article', {
    title: 'Новости',
    article,
    news,
    isNews: true,
  });
});

router.post('/subscribe', async (req, res) => {
  try {
    if (!req.body) return res.sendStatus(400);

    const data = JSON.parse(req.body.request);
    let alreadyExist = await Subscriber.findOne({ email: data.email });

    if (alreadyExist) {
      alreadyExist = null;
      return res.sendStatus(403);
    }

    const newSub = Subscriber({
      name: data.name,
      email: data.email,
    });

    await newSub.save((err) => {
      if (err) {
        res.sendStatus(400);
        throw err;
      }
      res.sendStatus(200);
    });
  } catch (err) {
    res.sendStatus(400);
    throw err;
  }
});

router.post('/subscribe/:id', async (req, res) => {
  try {
  } catch (err) {
    throw err;
  }
});

function paginatedResults(model) {
  return async (req, res, next) => {
    const page = parseInt(req.query.p);
    // const limit = parseInt(req.query.limit);
    const limit = 8;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};

    if (endIndex < (await model.countDocuments().exec())) {
      results.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit,
      };
    }

    try {
      results.results = await model
        .find()
        .limit(limit)
        .sort({ date: -1 })
        .skip(startIndex)
        .lean()
        .exec();
      const count = await model.find().count();
      const pagesCount = Math.ceil(count / limit);
      results.pagesCount = pagesCount;
      results.page = page;
      results.pageNums = [];

      for (let i = 1; i <= pagesCount; i++) {
        results.pageNums.push({ num: i, current: page });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
      console.log(err);
    }

    res.paginatedResults = results;
    next();
  };
}

router.post('/', paginatedResults(News), async (req, res) => {
  if (req.body.request) {
    await News.find(
      { $text: { $search: req.body.request } },
      { score: { $meta: 'textScore' } },
      (err, news) => {
        res.send({ result: news });
      },
    ).sort({ score: { $meta: 'textScore' } });
  }
});

module.exports = router;
