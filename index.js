const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const multer = require('multer');
const helpers = require('handlebars-helpers')(['date']);
const {
  homeRoutes,
  councilRoutes,
  activityRoutes,
  corpusRoutes,
  documentsRoutes,
  contactsRoutes,
  corruptionRoutes,
  receptionRoutes,
  newsRoutes,
  userRoutes,
  uploadRoutes,
} = require('./routes/index');

const app = express();

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
});

app.engine('hbs', hbs.engine);

app.set('view engine', 'hbs');
app.set('veiws', 'views');

handlebars.registerHelper('trimString', function (passedString) {
  const theString = passedString.substring(0, 200) + '...';
  return new handlebars.SafeString(theString);
});
handlebars.registerHelper('if_eq', function (a, b, opts) {
  if (a == b) {
    return opts.fn(this);
  } else {
    return opts.inverse(this);
  }
});

// app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now());
  },
});
const upload = multer({ storage: storage });

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(multer({ dest: 'uploads' }).single('file'));
app.use('/', homeRoutes);
app.use('/council', councilRoutes);
app.use('/activity', activityRoutes);
app.use('/corpus', corpusRoutes);
app.use('/documents', documentsRoutes);
app.use('/news', newsRoutes);
app.use('/contacts', contactsRoutes);
app.use('/corruption', corruptionRoutes);
app.use('/reception', receptionRoutes);
app.use('/news', userRoutes);
app.use('/upload', uploadRoutes);

const PORT = process.env.PORT || 8089;

const start = async () => {
  try {
    const url =
      'mongodb+srv://admin:1234509876@cluster0.ts9am.mongodb.net/deputies?retryWrites=true&w=majority';
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    app.listen(PORT, () => {
      console.log(`Server has been started on port ${PORT}...`);
    });
  } catch (err) {
    console.log(err);
  }
};
start();

app.post('/reception/appeal', function (req, res, next) {
  let filedata = req.file;
  console.log(filedata);
  if (!filedata) res.send('Ошибка при загрузке файла');
  else res.send('Файл загружен');
});

sendQuestion = async (data) => {
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'zickrail@gmail.com',
      pass: 'neon1miami1980e',
    },
  });

  let mailOption = {
    from: '<zickrail@gmail.com>',
    to: 'zickrail@gmail.com',
    subject: 'Сайт gorsovet-26.ru',
    // text: `Имя: ${data.name}, \nТелефон: ${data.phone}, \nВопрос: ${data.question}`,
    html: data,
    // attachments: [{ filename: 'test.txt', path: '/uploads' }],
  };

  let info = await transporter.sendMail(mailOption);

  console.log('Message sent: %s', info.messageId);
  return true;
};
