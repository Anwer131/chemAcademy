const passport = require('passport');
const User = require('./models/user');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
const config = require('./config');

// Local Strategy
passport.use(new LocalStrategy(
  { usernameField: 'username', passwordField: 'password' },
  User.authenticate()
));

// Serialize and deserialize user
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Generate JWT Token
exports.getToken = (user) => {
  return jwt.sign({ _id: user._id }, config.secretKey, { expiresIn: '8h' });
};

// JWT Strategy Options
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.secretKey,
};

// JWT Strategy
passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
  console.log("🔍 JWT payload:", jwt_payload);  // Debug log for payload
  User.findById(jwt_payload._id)
    .then(user => {
      if (user) return done(null, user);
      return done(null, false);
    })
    .catch(err => done(err, false));
}));

// Middleware to verify JWT
exports.verifyUser = passport.authenticate('jwt', { session: false });

// Middleware to verify admin privileges
exports.verifyAdmin = (req, res, next) => {
  User.findById(req.user._id)
    .then(user => {
      if (user && user.admin) return next();
      const err = new Error('❌ You are not authorized to perform this operation!');
      err.status = 403;
      return next(err);
    })
    .catch(err => next(err));
};
