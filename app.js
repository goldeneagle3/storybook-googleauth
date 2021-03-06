const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const connectDB = require('./utils/connect');
const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');
const storyRoutes = require('./routes/story.routes');

dotenv.config();

// Passport Config
require('./utils/passport')(passport);

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Method override
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Handlebars Helpers
const {
  formatDate,
  stripTags,
  truncate,
  editIcon,
  select,
} = require('./helpers/hbs')

// Static Files - Handlebars

app.engine(
  '.hbs',
  exphbs({
    helpers: {
      formatDate,
      stripTags,
      truncate,
      editIcon,
      select,
    },
    defaultLayout: 'main',
    extname: '.hbs',
  })
);
app.set('view engine', '.hbs');

// Sessions

app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
  })
);

// Passwort middleware
app.use(passport.initialize());
app.use(passport.session());

// Set global var
app.use(function (req, res, next) {
  res.locals.user = req.user || null
  next()
})

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes

app.use('/', userRoutes);
app.use('/auth', authRoutes);
app.use('/stories', storyRoutes);

const start = () => {
  try {
    connectDB(process.env.MONGO_URI);
    app.listen(process.env.PORT, () =>
      console.log(
        `Server is listening on port http://localhost:${process.env.PORT}...`
      )
    );
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
