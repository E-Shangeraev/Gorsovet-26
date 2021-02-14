const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const helpers = require('handlebars-helpers')(['date']);
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
} = require('./routes/index');

const app = express();

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('veiws', 'views');
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
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
