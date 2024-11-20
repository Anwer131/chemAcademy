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

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// app.use(express.json());
app.use(passport.initialize());
app.use(express.json()); // Add this line to parse JSON request bodies
app.use(cors());
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

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



// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});