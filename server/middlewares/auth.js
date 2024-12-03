// Middleware to ensure the user is authenticated
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next(); // Proceed to the next middleware or route
    }
    res.redirect('/users/login'); // Redirect to login if not authenticated
  }
  
  module.exports = { ensureAuthenticated };
  