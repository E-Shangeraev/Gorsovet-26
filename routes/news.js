const { Router } = require('express');
const News = require('../models/News');
const User = require('../models/User');
const router = Router();

router.get('/', async (req, res) => {
  const news = await News.find({}).lean();
  console.log(news);
  res.render('news', {
    title: 'Новости',
    isNews: true,
    news,
  });
});

router.get('/:id', async (req, res) => {
  const article = await News.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }).lean();
  // await News.updateOne({ $inc: { views: 1 } });
  const news = await News.find({
    _id: { $ne: article['_id'] },
  })
    .sort({ _id: 1 })
    .limit(4)
    .lean();
  // console.log(news[0].views);

  // Проверяем есть ли IP такого пользователя в БД
  // const user = await User.find({
  //   ip: req.ip,
  // });
  // Если IP пользователя нет в БД, то сохраняем его
  // if (!user) {
  //   await User.insert({ ip: req.ip });
  //   await News.updateOne({ $inc: { views: 1 } });
  // }
  console.log(req.ip);
  // console.log(user);

  res.render('article', {
    title: 'Новости',
    article,
    news,
  });
});

module.exports = router;
