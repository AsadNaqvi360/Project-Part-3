var express = require('express');
var router = express.Router();

// Ensure users are authenticated before accessing the home page or any other protected route
router.get('/', function (req, res) {
  if (!req.isAuthenticated()) {
    return res.redirect('/users/login'); // Redirect to login page if not authenticated
  }
  res.render('index', { title: 'Home' });
});

// GET aboutus page
router.get('/aboutus', function (req, res) {
  if (!req.isAuthenticated()) {
    return res.redirect('/users/login'); // Redirect to login page if not authenticated
  }
  res.render('aboutus', { title: 'About Us' });
});

// GET products page
router.get('/products', function (req, res) {
  if (!req.isAuthenticated()) {
    return res.redirect('/users/login'); // Redirect to login page if not authenticated
  }
  res.render('products', { title: 'Products' });
});

// GET service page
router.get('/service', function (req, res) {
  if (!req.isAuthenticated()) {
    return res.redirect('/users/login'); // Redirect to login page if not authenticated
  }
  res.render('service', { title: 'Service' });
});

// GET contactus page
router.get('/contactus', function (req, res) {
  if (!req.isAuthenticated()) {
    return res.redirect('/users/login'); // Redirect to login page if not authenticated
  }
  res.render('contactus', { title: 'Contact Us' });
});

module.exports = router;
