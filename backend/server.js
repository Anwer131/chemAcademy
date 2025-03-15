const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
var authRouter = require("./routes/auth");
var userRouter = require("./routes/users")
var coursesRouter = require("./routes/courses");
var booksRouter = require("./routes/books");
var profileRouter = require("./routes/profile")
var ratingRouter = require("./routes/ratings")
var roomRouter = require("./routes/rooms");
var threadRouter = require("./routes/threads");

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(passport.initialize());
app.use(express.json()); // Add this line to parse JSON request bodies
app.use(cors());
app.use('/uploads', express.static('uploads'));

const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
  console.error('❌ MONGODB_URI is not defined. Please check environment variables.');
  process.exit(1);  // Exit if URI is missing
}

mongoose.connect(mongoURI)
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1);  // Exit process on connection failure
});

// Passport configuration
require('./authenticate');

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the chemacademy website backend!');
});

app.use('/auth',authRouter);
app.use('/courses',coursesRouter);
app.use('/books',booksRouter);
app.use('/profile',profileRouter);
app.use('/users',userRouter);
app.use('/ratings',ratingRouter);
app.use('/rooms',roomRouter);
app.use('/threads',threadRouter);


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});