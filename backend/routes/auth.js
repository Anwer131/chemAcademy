const express = require('express');
const router = express.Router();
const passport = require('passport');
const bodyParser = require('body-parser');
const User = require('../models/user');
const authenticate = require('../authenticate');
const cors = require('./cors');

router.use(bodyParser.json());

// CORS Preflight
router.options('*', cors.corsWithOptions, (req, res) => res.sendStatus(200));

// 🔑 GET all users (Admin only)
router.get('/', cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  User.find({})
    .then(users => res.status(200).json({ success: true, users }))
    .catch(err => next(err));
});

// 📝 User Signup
router.post('/signup', cors.corsWithOptions, (req, res, next) => {
  User.register(new User({ username: req.body.username }), req.body.password)
    .then(user => {
      user.firstname = req.body.firstname || '';
      user.lastname = req.body.lastname || '';
      return user.save();
    })
    .then(user => {
      passport.authenticate('local')(req, res, () => {
        res.status(200).json({ success: true, status: '✅ Registration Successful!' });
      });
    })
    .catch(err => {
      console.error("🔥 Signup error:", err);
      res.status(500).json({ success: false, status: '❌ Registration Failed', error: err.message });
    });
});

// 🔓 User Login
router.post('/login', cors.corsWithOptions, (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: '⚠️ Missing credentials' });
  }

  User.authenticate()(username, password, (err, user, info) => {
    if (err) {
      console.error("🔥 Authentication error:", err);
      return res.status(500).json({ success: false, status: '❌ Error during authentication', error: err.message });
    }

    if (!user) {
      console.warn("⚠️ Login failed:", info);
      return res.status(401).json({ success: false, status: '❌ Login unsuccessful', message: info.message });
    }

    const token = authenticate.getToken({ _id: user._id });
    res.status(200).json({
      success: true,
      status: '✅ Login successful',
      token,
      user: {
        _id: user._id,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        admin: user.admin
      }
    });
  });
});

// 🚪 User Logout
router.get('/logout', cors.corsWithOptions, (req, res) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.status(200).json({ success: true, status: '✅ Successfully logged out' });
  } else {
    res.status(403).json({ success: false, message: '⚠️ You are not logged in' });
  }
});

// 🔍 Check JWT Token Validity
router.get('/checkJWTToken', cors.corsWithOptions, (req, res) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) return res.status(500).json({ success: false, status: '❌ JWT verification error', error: err.message });
    if (!user) return res.status(401).json({ success: false, status: '❌ Invalid JWT', error: info });

    res.status(200).json({ success: true, status: '✅ JWT is valid', user });
  })(req, res);
});

module.exports = router;
