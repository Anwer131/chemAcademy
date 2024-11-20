var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser')
var User = require('../models/user');
var passport = require('passport');
var authenticate = require('../authenticate')
var cors = require('./cors');
var Course = require("../models/course")

router.use(bodyParser.json());

router.get('/all', cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, function(req, res, next) {  
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
  
  // Route to get enrolled courses details
  router.get('/enrolled-courses', cors.cors, authenticate.verifyUser, async (req, res) => {
    try {
      // Fetch the course details using the user's enrolled course IDs
      const courses = await Course.find({ _id: { $in: req.user.courses } });
      res.status(200).json(courses);
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
      res.status(500).json({ message: 'Failed to fetch enrolled courses' });
    }
  });
  router.post('/unenroll/:courseCode',cors.cors, authenticate.verifyUser, async (req, res) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { $pull: { courses: { code: req.params.courseCode } } },
        { new: true }
      );
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: 'Error unenrolling from course' });
    }
  });
module.exports = router;