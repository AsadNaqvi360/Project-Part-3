const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../model/user'); // Import your User model
const bcrypt = require('bcryptjs'); // Replace bcrypt with bcryptjs

// Configure the LocalStrategy
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      // Find user by username
      const user = await User.findOne({ username });
      if (!user) {
        return done(null, false, { message: 'Incorrect username or password.' });
      }

      // Compare hashed passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: 'Incorrect username or password.' });
      }

      // Authentication successful
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
