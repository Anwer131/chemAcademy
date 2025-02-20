var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser')
var passport = require('passport');
var Rating = require("../models/rating")
var authenticate = require('../authenticate')
var cors = require('./cors');

router.use(bodyParser.json());

// Submit a rating
router.post("/", cors.cors, authenticate.verifyUser, async (req, res) => {
    const { rating } = req.body;
    const userId = req.user._id;
    // console.log(userId)
    try {
        // Check if the user has already rated
        const existingRating = await Rating.findOne({ userId });

        if (existingRating) {
            // Update the existing rating
            existingRating.rating = rating;
            await existingRating.save();
            return res.status(200).json({ message: "Rating updated successfully!" });
        }

        // Create a new rating
        const newRating = new Rating({ userId, rating });
        await newRating.save();
        res.status(201).json({ message: "Rating submitted successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
// Fetch average rating
router.get("/", cors.cors, async (req, res) => {
    // console.log(req.body);
    try {
        const ratings = await Rating.find();
        const averageRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length || 0;
        averageRating = averageRating.toFixed(1);

        res.status(200).json({ averageRating, totalRatings: ratings.length });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
