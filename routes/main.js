const { Router } = require('express');
const router = Router();
const Deputie = require('../models/Deputie');
const Calendar = require('../models/Calendar');
const News = require('../models/News');
const bodyParser = require('body-parser');

router.get('/', async (req, res) => {
  const deputies = await Deputie.find().lean();
  const news = await News.find().sort({ x: 1 }).limit(20).lean();

  res.render('main', {
    title: 'Главная',
    isMain: true,
    deputies,
    news,
  });
});

router.get('/calendar', async (req, res) => {
  const calendar = await Calendar.find({});
  res.json(calendar);
});

router.post('/question', bodyParser(), async (req, res) => {
  console.log(req.body);
  if (req.body.name.length != 0 || req.body.phone.length != 0 || req.body.question.length != 0) {
    try {
      const message = `
        <h2>Письмо с сайта gorsovet-26.ru</h2>
        <hr>
        <p>
          <b>Имя: </b>
          ${req.body.name}
        </p>
        <hr>
        <p>
          <b>Телефон: </b>
          ${req.body.phone}
        </p>
        <hr>
        <p>
          <b>Вопрос: </b>
          ${req.body.question}
        </p>
        <hr>
      `;
      await sendQuestion(message);
      res.send('1');
    } catch (err) {
      console.log(err);
    }
  } else {
    res.send('0');
  }
});

module.exports = router;
