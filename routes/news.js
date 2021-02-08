const { Router } = require('express');
const News = require('../models/News');
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
  const article = await News.findById(req.params.id).lean();
  const news = await News.find({
    _id: { $ne: article['_id'] },
  })
    .sort({ _id: 1 })
    .limit(4)
    .lean();
  console.log(news);
  res.render('article', {
    title: 'Новости',
    article,
    news,
  });
});

module.exports = router;
