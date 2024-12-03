var express = require('express');
var router = express.Router();

// GET home page
router.get('/', function (req, res) {
  res.render('index', { title: 'Home' });
});

// GET aboutus page
router.get('/aboutus', function (req, res) {
  res.render('aboutus', { title: 'About Us' });
});

// GET products page
router.get('/products', function (req, res) {
  res.render('products', { title: 'Products' });
});

// GET service page
router.get('/service', function (req, res) {
  res.render('service', { title: 'Service' });
});

// GET contactus page
router.get('/contactus', function (req, res) {
  res.render('contactus', { title: 'Contact Us' });
});

module.exports = router;
