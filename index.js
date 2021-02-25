const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const handlebars = require('handlebars');
const exphbs = require('express-handlebars');
// const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const multer = require('multer');
const helpers = require('handlebars-helpers')(['date']);
const { default: AdminBro } = require('admin-bro');
const AdminBroExpress = require('admin-bro-expressjs');
const options = require('./admin/admin.options');
// const formidable = require('express-formidable');
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
  buildAdminRouter,
  searchRoutes,
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

const admin = new AdminBro(options);
const router = buildAdminRouter(admin);
app.use(admin.options.rootPath, router);

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
// app.use(formidable());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(multer({ dest: 'uploads' }).single('file'));
app.use('/', homeRoutes);
app.use('/council', councilRoutes);
app.use('/activity', activityRoutes);
app.use('/corpus', corpusRoutes);
app.use('/documents', documentsRoutes);
app.use('/news', newsRoutes);
app.use('/contacts', contactsRoutes);
app.use('/corruption', corruptionRoutes);
app.use('/reception', receptionRoutes);
app.use('/search', searchRoutes);

const PORT = process.env.PORT || 8089;

const start = async () => {
  try {
    const url =
      'mongodb+srv://gorsovet26:gfhjkmujhcjdtnf26@cluster0.a8cvf.mongodb.net/gorsovet26?retryWrites=true&w=majority';
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
    html: data,
    // attachments: [{ filename: 'test.txt', path: '/uploads' }],
  };

  let info = await transporter.sendMail(mailOption);

  console.log('Message sent: %s', info.messageId);
  return true;
};
