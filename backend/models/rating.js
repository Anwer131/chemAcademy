const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User who rated
    rating: { type: Number, required: true, min: 1, max: 5 },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("OverallRating", ratingSchema);
