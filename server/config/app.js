let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let app = express();
let indexRouter = require('../routes/index');
let usersRouter = require('../routes/users');
let inventoryRouter = require('../routes/book'); // Updated router to handle inventory

// Set up MongoDB connection
const mongoose = require('mongoose');
let DB = require('./db');
mongoose.connect(DB.URI, { useNewUrlParser: true, useUnifiedTopology: true });
let mongoDB = mongoose.connection;
mongoDB.on('error', console.error.bind(console, 'Connection Error'));
mongoDB.once('open', () => {
    console.log("Connected with MongoDB");
});

// Passport.js and Session setup
const passport = require('./passport'); // Import the Passport.js configuration
const session = require('express-session');
const MongoStore = require('connect-mongo');

// Flash messages setup
const flash = require('connect-flash'); // Import connect-flash

// Session setup with MongoDB store
app.use(
  session({
    secret: 'your_secret_key', // Replace with a strong secret
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: DB.URI, // MongoDB URI for session storage
    }),
  })
);

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Initialize connect-flash
app.use(flash());

// Middleware to make flash messages available globally
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Middleware to make the user object available globally
app.use((req, res, next) => {
  res.locals.user = req.user; // Attach the logged-in user to res.locals
  next();
});

// Middleware to redirect unauthenticated users to the login page
app.use((req, res, next) => {
  if (!req.isAuthenticated() && req.path !== '/users/login' && req.path !== '/users/register') {
    return res.redirect('/users/login');
  }
  next();
});

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

// Middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Static files setup for Bootstrap and custom CSS
app.use(express.static(path.join(__dirname, '../../public'))); // Serves public files, including CSS
app.use(express.static(path.join(__dirname, '../../node_modules'))); // Serves node_modules for Bootstrap

// Route setup
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/inventory', inventoryRouter); // Updated path

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error', { title: 'Error' });
});

module.exports = app;
