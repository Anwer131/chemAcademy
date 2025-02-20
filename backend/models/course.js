// courseModel.js

const mongoose = require('mongoose');
const feedBackSchema = new mongoose.Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},{
    timestamps: true
})
const coursePolicySchema = new mongoose.Schema({
    minor: {
        type: String
    },
    major: {
        type: String
    },
    project: {
        type: String
    },
    assignments: {
        type: String
    },
    quiz: {
        type: String
    },
    tutorials: {
        type: String
    },
    miscelleneous: {
        type: String
    },
    attendancePolicy: {
        type: String
    },
    other: {
        type: [String],
        default:[]
    }
})
const professorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    policy: {
        type:coursePolicySchema
    },
    lectures: {
        label: { type: String, required: true },
        link: { type: String, required: true }
    },
    tutorials: {
        label: { type: String, required: true },
        link: { type: String, required: true }
    },
    pyq: {
        label: { type: String, required: true },
        link: { type: String, required: true }
    },
    feedback: [feedBackSchema]
})

const courseSchema = new mongoose.Schema({
  code:{
    type:String,
    required:true,
    unique:true
  },
  title: {
    type: String,
    required: true,
    unique:true
  },
  books: [{
    type: mongoose.Schema.Types.ObjectId,
    ref:'Book'
  }],
  professors: [professorSchema]
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
