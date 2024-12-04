let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

require('dotenv').config(); // Load environment variables

// Debugging lines to verify environment variables
console.log("DEBUG: Environment Variables");
console.log("DEBUG: DB_URI:", process.env.DB_URI);
console.log("DEBUG: SESSION_SECRET:", process.env.SESSION_SECRET);
console.log("DEBUG: PORT:", process.env.PORT);

if (!process.env.DB_URI || !process.env.SESSION_SECRET) {
  console.error("ERROR: Missing environment variables.");
  throw new Error("Missing environment variables: Ensure DB_URI and SESSION_SECRET are defined in .env file.");
}

let app = express();

// Correct paths to routes
let indexRouter = require('../routes/index'); // Relative path to index.js in routes
let usersRouter = require('../routes/users'); // Relative path to users.js in routes
let inventoryRouter = require('../routes/book'); // Relative path to book.js in routes

// Set up MongoDB connection
const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
let mongoDB = mongoose.connection;
mongoDB.on('error', console.error.bind(console, 'Connection Error'));
mongoDB.once('open', () => {
  console.log("DEBUG: Connected to MongoDB Atlas");
});

// Passport.js and Session setup
const passport = require('./passport'); // Import Passport.js configuration
const session = require('express-session');
const MongoStore = require('connect-mongo');

// Flash messages setup
const flash = require('connect-flash'); // Import connect-flash

// Session setup with MongoDB store
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Use .env for secure configuration
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DB_URI, // Use .env MongoDB URI
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
  console.log(`DEBUG: Authenticated: ${req.isAuthenticated()} | Path: ${req.path}`);
  // Exclude login, register, and home from being redirected if not logged in
  if (
    !req.isAuthenticated() &&
    !['/users/login', '/users/register', '/'].includes(req.path) &&
    !req.path.startsWith('/users')
  ) {
    return res.redirect('/users/login');
  }
  next();
});

// View engine setup
app.set('views', path.join(__dirname, '../views')); // Correct path to views
app.set('view engine', 'ejs');

// Middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Static files setup for Bootstrap
app.use(express.static(path.join(__dirname, '../public'))); // Serves public files
app.use('/bootstrap', express.static(path.join(__dirname, '../../node_modules/bootstrap/dist'))); // Correct Bootstrap path

// Route setup
app.use('/', indexRouter); // Correct path to index.js
app.use('/users', usersRouter); // Correct path to users.js
app.use('/inventory', inventoryRouter); // Correct path to book.js

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error', { title: 'Error' });
});

module.exports = app;
