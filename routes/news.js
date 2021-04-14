const { Router } = require('express');
const router = Router();
const newsController = require('../controllers/newsController');
const News = require('../models/News');

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

router.get('/', paginatedResults(News), newsController.news);
router.get('/:id', newsController.article);
router.post('/subscribe', newsController.subscribe);
router.get('/subscribe/:subscriber', newsController.confirmSubscribe);
// router.get('/unsubscribe/:subscriber', newsController.unsubscribe);
router.post('/', paginatedResults(News), newsController.search);

module.exports = router;
