var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser')
var User = require('../models/user');
var passport = require('passport');
var authenticate = require('../authenticate')
var cors = require('./cors');

router.use(bodyParser.json());

/* GET users listing. */
router.options('*',cors.corsWithOptions,(req,res) => {res.statusCode(200);});
router.get('/', cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, function(req, res, next) {  
  User.find({})
  .then((users) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({ success:true, users: users})
  }, (err) => next(err))
  .catch((err) => next(err))
});
router.put('/:userId/toggle-admin', authenticate.verifyUser, authenticate.verifyAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (user) {
      user.admin = req.body.admin;
      await user.save();
      res.status(200).json({ success: true });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/signup', cors.corsWithOptions, (req, res, next) => {
  User.register(new User({ username: req.body.username}), req.body.password)
    .then(user => {
      // Additional fields
      if (req.body.firstname) {
        user.firstname = req.body.firstname;
      }
      if (req.body.lastname) {
        user.lastname = req.body.lastname;
      }
      return user.save();
    })
    .then(user => {
      passport.authenticate('local')(req, res, () => {

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({ success: true, status: 'Registration Successful!' });
      });
    })
    .catch(err => {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({ err: err });
    });
});

router.post('/login', cors.corsWithOptions, async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Missing credentials' });
  }

  // Use passport-local-mongoose's authenticate method directly
  const auth = User.authenticate();
  auth(username, password, (err, user, info) => {
    if (err) {
      console.error("Authentication error:", err);
      return res.status(500).json({ success: false, status: 'Error during authentication', err });
    }

    if (!user) {
      console.log("User not found or incorrect password:", info);
      return res.status(401).json({ success: false, status: 'Login unsuccessful!', err: info.message });
    }

    // Instead of using req.logIn(), generate a JWT token directly
    const token = authenticate.getToken({ _id: user._id });
    return res.status(200).json({
      success: true,
      status: 'Login successful!',
      token,
      user: {
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        admin: user.admin
      }
    });
  });
});
router.get('/logout', cors.corsWithOptions, (req,res, next) => {
  if (req.session) {
    req.session.destroy(); //remove the session information in the server side.
    res.clearCookie('session-id'); // this is used to clear the cookie in the client side.
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    return next(err);
  }
})
router.get('/facebook/token', passport.authenticate('facebook-token', {session: false}),
(req, res) => {
  if(req.user) {
    var token = authenticate.getToken({_id: req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({ success:true, token: token, status: 'You are Successfuly logged in!'})
  }
})
router.get('/checkJWTToken',cors.corsWithOptions, (req,res) => {
  passport.authenticate('jwt',{session:false}, (err,user, info) => {
    if(err){
      return next(err);
    }
    if(!user){
      res.statusCode = 401;
      res.setHeader('Content-Type','application/json');
      res.json({status:'JWT Token invalid', success:false,err:info})
    }else{
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({ status:'JWT Token valid', success:true, user:user})
    }
  }) (req,res);
})
module.exports = router;