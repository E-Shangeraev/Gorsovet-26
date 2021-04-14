const News = require('../models/News');
const Report = require('../models/Report');
const Subscriber = require('../models/Subscriber');

News.watch().on('change', async (data) => {
  const subscribers = await Subscriber.find({ status: 1 }).lean();
  const emails = subscribers.map((item) => item.email).join(', ');
  const added = data.fullDocument;

  if (added) {
    const news = `
      <div style="background-color: #f8f8f8; padding: 5%; border-radius: 6px;">
        <h2>${added.title}</h2>
        <hr>
        <div style="margin: 5% 0;">${added.text}</div>
        <p style="display: flex; justify-content: space-between; margin-top: 5%">
          <a 
          style="
            display: inline-block;  
            background: #54b43c;
            border: 2px solid lightgray;
            color: #fff; 
            border-radius: 6px; 
            text-decoration: none; 
            padding: 15px 30px; 
            margin-top: 30px;" 
          href="gorsovet-26.ru/news/${added._id}">Читать в источнике</a>
        </p>
      </div>
    `;
    await subscribe(emails, 'Совет депутатов ЗАТО г. «Железногорск»', news);
  }
});

exports.news = async (req, res) => {
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
};

exports.article = async (req, res) => {
  const article = await News.findByIdAndUpdate(req.params.id, {
    $inc: { views: 1 },
  })
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
};

exports.subscribe = async (req, res) => {
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
      let candidate = await Subscriber.findOne({ email: data.email });

      const confirmMessage = `
        <div style="background-color: #f8f8f8; padding: 5%; border-radius: 6px;">
          <h2>Совет депутатов ЗАТО г. «Железногорск»</h2>
          <hr>
          <p>Для активации подписки нажмите на кнопку «Подтвердить» и будьте в курсе событий, происходящих в городе</p>
          <a style="
          display: inline-block; 
          background: #54b43c;
          border: 2px solid lightgray;
          color: #fff; 
          border-radius: 6px; 
          text-decoration: none; 
          padding: 15px 30px; 
          margin-top: 30px;"
          href="gorsovet-26.ru/news/subscribe/${candidate._id}">Подтвердить</a>
        </div>
      `;

      subscribe(candidate.email, 'Подвтердите подписку на новости', confirmMessage);
      res.sendStatus(200);
    });
  } catch (err) {
    res.sendStatus(400);
    throw err;
  }
};

exports.confirmSubscribe = async (req, res) => {
  const sub = await Subscriber.findOneAndUpdate(
    { _id: req.params.subscriber },
    { $set: { status: 1 } },
    { new: true },
  );
  res.render('subscribe', {
    title: 'Подтверждение подписки',
    layout: 'confirm',
  });
};

exports.unsubscribe = async (req, res) => {
  await Subscriber.findOneAndRemove({ _id: req.params.subscriber });
  res.json(req.params.subscriber);
};

exports.search = async (req, res) => {
  if (req.body.request) {
    await News.find(
      { $text: { $search: req.body.request } },
      { score: { $meta: 'textScore' } },
      (err, news) => {
        res.send({ result: news });
      },
    ).sort({ score: { $meta: 'textScore' } });
  }
};
