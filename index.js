const express = require('express');
const config = require('config');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const nodemailer = require('nodemailer');
const multer = require('multer');
const helpers = require('handlebars-helpers')(['date']);
const { default: AdminBro } = require('admin-bro');
const AdminBroExpress = require('admin-bro-expressjs');
const options = require('./admin/admin.options');
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

handlebars.registerHelper('trimString', function (passedString, symbols) {
  const theString = passedString.substring(0, symbols).trim() + '...';
  return new handlebars.SafeString(theString);
});
handlebars.registerHelper('if_eq', function (a, b, opts) {
  if (a == b) {
    return opts.fn(this);
  } else {
    return opts.inverse(this);
  }
});
handlebars.registerHelper('isActive', function (getParam, num, className) {
  const activeClass = className;

  if (getParam == num) {
    return activeClass;
  } else {
    return '';
  }
});

const admin = new AdminBro(options);
const router = buildAdminRouter(admin);
app.use(admin.options.rootPath, router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(multer({ dest: 'uploads/' }).single('file'));
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

const PORT = config.get('port') || 8089;

const start = async () => {
  try {
    const url = config.get('mongoUrl');
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });

    app.listen(PORT, () => {
      console.log(`Server has been started on port ${PORT}...`);
    });
  } catch (err) {
    console.log(err);
  }
};
start();

// Функция отправки обращения
sendQuestion = async (data, fileName = '', originalName = '') => {
  let transporter = nodemailer.createTransport({
    host: 'smtp.yandex.ru',
    port: 587,
    secure: false,
    auth: {
      user: config.get('user'),
      pass: config.get('password'),
    },
  });

  let mailOption = {
    from: `<${config.get('user')}>`,
    to: config.get('user'),
    subject: 'Совет депутатов ЗАТО г. «Железногорск»',
    html: data,
  };

  if (fileName) {
    mailOption.attachments = [
      {
        filename: originalName,
        path: path.join(__dirname, 'uploads/', fileName),
        encoding: 'base64',
      },
    ];
  }

  let info = await transporter.sendMail(mailOption);

  // Удаление файлов из директории после отправки письма
  const directory = path.join(__dirname, 'uploads');

  fs.readdir(directory, (err, files) => {
    if (err) throw err;

    for (let file of files) {
      fs.unlink(path.join(directory, file), (err) => {
        if (err) throw err;
      });
    }
  });

  console.log('Message sent: %s', info.messageId);
  return true;
};

// Подписка на новсти
subscribe = async (subs, subject, data) => {
  let transporter = nodemailer.createTransport({
    host: 'smtp.yandex.ru',
    port: 465,
    secure: true,
    auth: {
      user: config.get('user'),
      pass: config.get('password'),
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  transporter.verify((err, success) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Server is ready to take our message: ', success);
    }
  });

  let mailOption = {
    from: `<${config.get('user')}>`,
    to: subs,
    subject,
    html: data,
  };

  transporter.sendMail(mailOption, (err, response) => {
    if (err) {
      console.log('Error: ', err);
    } else {
      console.log('Email sent successfully: ', response);
    }
    transporter.close();
  });
  return true;
};
