const { Router } = require('express');
const News = require('../models/News');
const Report = require('../models/Report');
const Subscriber = require('../models/Subscriber');
const router = Router();
const url = require('url');

const changeStream = News.watch().on('change', async (data) => {
  // console.log(data.fullDocument);
  const subscribers = await Subscriber.find({ status: 1 }).lean();
  const emails = subscribers.map((item) => item.email).join(', ');
  // const sub = subscribers.map((item) => item.email).join(', ');
  console.log(subscribers);
  console.log(emails);
  const added = data.fullDocument;
  if (added) {
    const news = `
      <div style="background-color: #f8f8f8; padding: 5%; border-radius: 6px;">
        <h2>${added.title}</h2>
        <hr>
        <div style="margin: 5% 0;">${added.text}</div>
        <p style="display: flex; justify-content: space-between; margin-top: 5%"></p>
        <a 
        style="
          display: block; 
          width: fit-content; 
          background: #54b43c;
          border: 2px solid lightgray;
          color: #fff; 
          border-radius: 6px; 
          text-decoration: none; 
          padding: 15px 30px; 
          margin-top: 30px;" 
        href="gorsovet-26.ru/news/${added._id}">Читать</a>
      </div>
    `;
    await subscribe('smtp.yandex.ru', 587, emails, 'gorsovet-26.ru опубликовал новость', news);
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

    await newSub.save(async (err) => {
      if (err) {
        res.sendStatus(400);
        throw err;
      }
      let candidat = await Subscriber.findOne({ email: data.email });
      console.log(candidat);

      const confirmMessage = `
        <div style="background-color: #adadad">
          <h2>Сайт gorsovet-26.ru</h2>
          <hr>
          <a href="gorsovet-26.ru/news/subscribe/${candidat._id}">Подтвердить</a>
        </div>
      `;

      subscribe(
        'smtp.yandex.ru',
        587,
        'eldar@mygang.ru',
        'Подвтердите подписку на новости',
        confirmMessage,
      );
      res.sendStatus(200);
    });
  } catch (err) {
    res.sendStatus(400);
    throw err;
  }
});

router.get('/subscribe/:subscriber', async (req, res) => {
  console.log(`Добавляем пользователя ${req.params.subscriber}`);
  const sub = await Subscriber.findOneAndUpdate(
    { _id: req.params.subscriber },
    { $set: { status: 1 } },
    { new: true },
  );
  console.log(sub);
  res.json(req.params.subscriber);
});

router.get('/unsubscribe/:subscriber', async (req, res) => {
  console.log(`Удаляем пользователя ${req.params.subscriber}`);
  await Subscriber.findOneAndRemove({ _id: req.params.subscriber });
  res.json(req.params.subscriber);
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
