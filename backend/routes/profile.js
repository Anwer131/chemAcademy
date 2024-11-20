const express = require('express');
const multer = require('multer');
const User = require('../models/user');
const authenticate = require('../authenticate');
const router = express.Router();
const cors = require("./cors")

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files in the "uploads" directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Route to update profile picture and name
router.put('/update', authenticate.verifyUser, upload.single('profilePic'), async (req, res) => {
  try {
    const updates = {};

    // Update first name and last name if provided
    if (req.body.firstName) updates.firstName = req.body.firstName;
    if (req.body.lastName) updates.lastName = req.body.lastName;

    // Update profile picture if a file is uploaded
    if (req.file) {
      updates.profilePic = req.file.path;
    }

    // Update the user in the database
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true }
    );

    res.status(200).json({ success: true, user: updatedUser });
  } catch (err) {
    console.error('Profile Update Error:', err);
    res.status(500).json({ success: false, message: 'Profile update failed', error: err.message });
  }
});

module.exports = router;
