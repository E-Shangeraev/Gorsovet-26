const Deputie = require('../models/Deputie');

exports.reception = async (req, res) => {
  const deputies = await Deputie.find().sort({ id: 1 }).lean();
  res.render('reception', {
    title: 'Онлайн-приемная',
    deputies,
  });
};

exports.deputieSelected = async (req, res) => {
  const deputieSelected = await Deputie.find({ _id: req.params.id }).lean();
  const deputies = await Deputie.find().sort({ id: 1 }).lean();
  res.render('reception', {
    title: 'Онлайн-приемная',
    deputie: deputieSelected[0],
    deputies,
  });
};

exports.appeal = async (req, res) => {
  let file;

  if (req.body.deput) {
    try {
      let message = `
        <h2>Обращение с сайта gorsovet-26.ru</h2>
        <hr>
        <p>
          <b>Кому: </b>
          ${req.body.deput}
        </p>
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
          <b>Email: </b>
          ${req.body.email}
        </p>
        <hr>
        <p>
          <b>Адрес: </b>
          ${req.body.address}
        </p>
        <hr>
        <p>
          <b>Текст обращения: </b>
          ${req.body.question}
        </p>
        <hr>
      `;

      if (req.file) {
        file = req.file;

        message += `
          <p>
            <b>Прикрепленный файл: </b>
            ${file.originalname}
          </p>
          <hr>
        `;

        await sendQuestion(message, file.filename, file.originalname);
      } else {
        await sendQuestion(message);
      }
      res.send('1');
    } catch (err) {
      console.log(err);
    }
  } else {
    res.send('0');
  }
};

exports.searchTips = async (req, res) => {
  if (req.body.action == 'search') {
    let params = {};
    const textArray = req.body.request.split(' ');
    let textKey = '';
    textArray.forEach((text, index) => {
      if (index == 0) {
        textKey = '"' + text + '"';
      } else {
        textKey += ' ' + '"' + text + '"';
      }
    });
    params.$text = { $search: textKey };

    let inputValue = req.body.request
      .replace(/ул. /g, '')
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
      .replace(/\s{2,}/g, ' ');

    const regMarks = '([., /#!$%^&*;:{}=-_`~()]+)?';
    inputValue = inputValue.split(' ').join(regMarks);
    const reg = new RegExp(inputValue, 'gi');

    await Deputie.find(params, (err, deputie) => {
      deputie.forEach((deput) => {
        let a = deput.address
          .map((addr) => {
            if (addr.match(reg)) {
              return addr;
            }
          })
          .filter((addr) => addr);
        deput.address = a;
      });
      res.send({ result: deputie });
    }).sort({ score: { $meta: 'textScore' } });
  }
};

exports.search = async (req, res) => {
  await Deputie.find({ _id: req.body.request }, (err, deputie) => {
    res.send({ result: deputie });
  });
};
