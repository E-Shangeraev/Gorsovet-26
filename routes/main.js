const { Router } = require('express');
const Deputie = require('../models/Deputie');
const Calendar = require('../models/Calendar');
const News = require('../models/News');
const router = Router();

router.get('/', async (req, res) => {
  const deputies = await Deputie.find().lean();
  const news = await News.find().sort({ x: 1 }).limit(3).lean();

  res.render('main', {
    title: 'Главная',
    isMain: true,
    deputies,
    news,
  });
});

router.get('/calendar', async (req, res) => {
  const calendar = await Calendar.find({});
  console.log(calendar);
  res.json(calendar);
});

module.exports = router;
