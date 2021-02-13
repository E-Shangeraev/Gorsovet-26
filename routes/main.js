const { Router } = require('express');
const Calendar = require('../models/Calendar');
const router = Router();

router.get('/', async (req, res) => {
  res.render('main', {
    title: 'Главная',
    isMain: true,
  });
});

router.get('/calendar', async (req, res) => {
  const calendar = await Calendar.find({});
  console.log(calendar);
  res.json(calendar);
});

module.exports = router;
