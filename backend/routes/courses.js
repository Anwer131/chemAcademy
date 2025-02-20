const { createFolder } = require('../configDrive');
const express = require('express');
const router = express.Router();
const Course = require('../models/course');
const User = require("../models/user")
const authenticate = require('../authenticate');
const cors = require('./cors');
const Book = require('../models/book');


router.use(express.json());

router.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, async (req, res) => {
  try {
    const stdCode = req.body.code ? req.body.code.slice(0, 3).toLowerCase() + req.body.code.slice(3)
                  : req.body.code
    const existingCourse = await Course.findOne({ code: stdCode });
    if (existingCourse) {
      return res.status(400).json({ message: 'Course already exists' });
    }
    const course = new Course({ code: stdCode, title:req.body.title});
    await course.save();
    
    res.status(201).json(course);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
})
.get(cors.cors, authenticate.verifyUser, async (req, res) => {
  try {
    var courses = await Course.find();
    res.json(courses);
    // console.log(courses)
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:courseId', authenticate.verifyUser, authenticate.verifyAdmin, async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete({_id:req.params.courseId});
    res.json(deletedCourse);
  } catch (error) {
    console.log(error);
  }
})
//handling individual courses
router.route('/:courseCode')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors,authenticate.verifyUser,(req,res,next)=>{
  Course.findOne({code:req.params.courseCode})
  .then((course)=>{
    if(course==null){
      err = new Error('Course: ' + req.params.courseCode+ ' not found');
      err.status = 404;
      return next(err);
    }
    res.setHeader('Content-Type','Application/json');
    res.json(course);
  }, (err) => next(err))
  .catch((err)=>next(err))
})

// Enroll a user in a course
router.post('/:courseId/enroll', authenticate.verifyUser, async (req, res) => {
  try {
    const userId = req.user._id;
    const courseId = req.params.courseId;

    // Update the user's courses array using $addToSet to prevent duplicates
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { courses: courseId } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, message: 'Successfully enrolled in the course', user: updatedUser });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});


// Route to enroll a user in a course
router.post('/:courseId/enroll', authenticate.verifyUser, async (req, res) => {
  try {
    const userId = req.user._id;
    const courseId = req.params.courseId;

    // Convert courseId to ObjectId
    const courseObjectId = mongoose.Types.ObjectId(courseId);

    // Check if the user is already enrolled in the course
    const user = await User.findById(userId);
    if (user.courses.includes(courseObjectId)) {
      return res.status(400).json({ success: false, message: 'You are already enrolled in this course' });
    }

    // Add the course to the user's courses list using $addToSet
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { courses: courseObjectId } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, message: 'Successfully enrolled in the course', user: updatedUser });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

//add a book to the course
router.route('/:courseCode/:bookId')
.options(cors.corsWithOptions,(req,res) => res.sendStatus(200))
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
  Course.findOne({code:req.params.courseCode})
  .then((course)=>{
    if(course==null){
      err = new Error('Course: ' + req.params.courseCode+ ' not found');
      err.status = 404;
      return next(err);
    }
    course.books.pull({_id:req.params.bookId});
    course.save()
    .then((updcourse)=>{
      res.status(200).json(updcourse);
    })
  }, (err) => next(err))
  .catch((err) => next(err))
})

// professor addition
router.route('/:courseCode/professors')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, async (req, res, next) => {
    try {
        // Find the course in the database
        const course = await Course.findOne({ code: req.params.courseCode });

        if (!course) {
            const err = new Error('Course: ' + req.params.courseCode + ' not found');
            err.status = 404;
            return next(err);
        }

        const {name,policy, lectures, tutorials, pyq} =  req.body;
        const newProfessor = {
          name,
          policy,
          lectures,
          tutorials,
          pyq,
          feedback: [],
        };
        // console.log(newProfessor);
        course.professors.push(newProfessor);
        const updatedCourse = await course.save();
        // console.log('Updated course:', updatedCourse);
        res.setHeader('Content-Type', 'application/json');
        res.json(updatedCourse);
    } catch (err) {
        next(err);
    }
});


//professors data
router.route('/:courseCode/:index')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
  Course.findOne({code:req.params.courseCode})
  .then((course) => {
    if(course==null){
      err = new Error('Course: ' + req.params.courseCode+ ' not found');
      err.status = 404;
      return next(err);
    }
    else if(course.professors.length<parseInt(req.params.index)+1){
      err = new Error('Less than ' + (parseInt(req.params.index)+1)+ ' professors data available');
      err.status = 404;
      return next(err);
    }
    // console.log("found course: ", course.professors[req.params.index]);
    res.setHeader('Content-Type','Application/json');
    res.json(course.professors[req.params.index]);
  },(err) => next(err))
  .catch((err) => next(err))
})

//Feedback
router.route('/:courseCode/:index/feedback')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
  Course.findOne({code:req.params.courseCode})
  .then((course)=>{
    if(course==null){
      err = new Error('Course: ' + req.params.courseCode+ ' not found');
      err.status = 404;
      return next(err);
    }
    else if(course.professors.length<parseInt(req.params.index)+1){
      err = new Error('Less than ' + (parseInt(req.params.index)+1)+ ' professors data available');
      err.status = 404;
      return next(err);
    }
    req.body.author = req.user._id;
    course.professors[req.params.index].feedback.push(req.body);
    course.save()
    .then((updatedcourse) => {
      Course.findById(updatedcourse._id)
      .populate('professors.feedback.author')
      .then((course)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(course);
      }, (err) => next(err))
    }, (err) => next(err))
  }, (err) => next(err))
  .catch((err)=>next(err))
})

//delete a feedback
router.route('/:courseCode/:index/feedback/:feedbackId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.delete(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
  Course.findOne({code:req.params.courseCode})
  .then((course)=>{
    if(course==null){
      err = new Error('Course: ' + req.params.courseCode+ ' not found');
      err.status = 404;
      return next(err);
    }
    else if(course.professors.length<parseInt(req.params.index)+1){
      err = new Error('Less than ' + (parseInt(req.params.index)+1)+ ' professors data available');
      err.status = 404;
      return next(err);
    }
    if (req.user._id.equals(course.professors[req.params.index].feedback.id(req.params.feedbackId).author._id)) {
      // const feedbackIndex = course.professors[req.params.index].feedback.findIndex(feedback => feedback._id.equals(req.params.feedbackId));
      course.professors[req.params.index].feedback.pull({_id:req.params.feedbackId});
      course.save()
      .then((course) => {
          Course.findById(course._id)
          .populate('professors.feedback.author')
          .then((course) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(course);                   
          }, (err) => next(err))
      }, (err) => next(err));
    }
    else {
        err = new Error('You are not authorised to delete this feedback');
        err.status = 403;
        return next(err);
    }
  }, (err) => next(err))
  .catch((err) => next(err))
});
module.exports = router;
