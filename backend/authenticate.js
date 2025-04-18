var passport = require('passport');
var User = require('./models/user');
var LocalStrategy = require('passport-local').Strategy;
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');

var config = require('./config');

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = (user) => { // creates json web token
    return jwt.sign(user, config.secretKey, {
        expiresIn: '48h' // token will expire in 360000 seconds
    }) 
};

var opts = {}; // Options for jwt strategy
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); // This will extract the token that will be later used to verify the user.
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload,done) => {
        // console.log("JWT payload :",jwt_payload);
        User.findOne({ _id: jwt_payload._id })
        .then(user => {
            if (user) {
                // If user is found, return user
                return done(null, user);
            } else {
                // If user is not found, return false
                return done(null, false);
            }
        })
        .catch(err => {
            // If an error occurs, return the error
            return done(err, false);
        });

}))

exports.verifyUser = passport.authenticate('jwt',{session: false}) // This implies that we are not going to create any session unlike previous case.
exports.verifyAdmin = (req, res, next) => {
    User.findById({_id: req.user._id})
    .then((user) => {
        if (user.admin) {
            next();
        }
        else {
            err = new Error('You are not authorized to perform this operation!');
            err.status = 403;
            return next(err);
        }
    },(err) => next(err))
    .catch((err) => next(err))
}