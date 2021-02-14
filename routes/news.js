const { Router } = require('express');
const News = require('../models/News');
const router = Router();

router.get('/', paginatedResults(News), async (req, res) => {
  const news = res.paginatedResults.results;
  const page = res.paginatedResults.page;
  const pagesCount = res.paginatedResults.pagesCount;
  const pageNums = res.paginatedResults.pageNums;

  res.render('news', {
    title: 'Новости',
    isNews: true,
    news,
    page,
    pagesCount,
    pageNums,
    next: page + 1,
    isNext: pagesCount > page,
  });
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
      results.results = await model.find().limit(limit).skip(startIndex).lean().exec();
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

    console.log(res.paginatedResults);
    next();
  };
}

router.get('/:id', async (req, res) => {
  const article = await News.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }).lean();
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
  });
});

module.exports = router;
