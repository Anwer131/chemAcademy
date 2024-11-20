const mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    default: ''
  },
  lastName: {
    type: String,
    default: ''
  },
  profilePic: {
    type: String,
    default:''
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  department: {
    type: String
  },
  year: {
    type: String
  },
  semester: {
    type: String
  },
  admin: {
    type: Boolean,
    default: false
  },
  // New field for storing courses and selected slots
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
}, {
  timestamps: true
});

// Virtual property to extract year and semester from entry number
userSchema.virtual('yearAndSemester').get(function () {
  const entryYear = parseInt(this.username.substring(0, 4));
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // Month is zero-based
  const yearDifference = currentYear - entryYear;

  let year, semester;

  if (currentMonth < 5) {
    year = yearDifference;
    semester = 2 * year;
  } else {
    year = yearDifference + 1;
    semester = 1 + 2 * year;
  }

  return { year, semester };
});

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User', userSchema);

module.exports = User;
