const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../model/user'); // Import your User model
const bcrypt = require('bcryptjs'); // For hashing passwords

// Render login page
router.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

// Authenticate user using Passport.js
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/inventory', // Redirect after successful login
    failureRedirect: '/users/login', // Redirect back to login on failure
    failureFlash: true, // Enable flash messages
  })
);

// Render registration page
router.get('/register', (req, res) => {
  res.render('register', { title: 'Register' });
});

// Handle user registration
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      req.flash('error_msg', 'Username is already registered.');
      return res.redirect('/users/register'); // Redirect with error message
    }

    // Hash password and save user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    req.flash('success_msg', 'Registration successful! Please log in.');
    res.redirect('/users/login'); // Redirect to login page with success message
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'An error occurred during registration. Please try again.');
    res.redirect('/users/register');
  }
});

// Logout route
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash('success_msg', 'You are logged out.');
    res.redirect('/users/login'); // Redirect to login after logout
  });
});

module.exports = router;
