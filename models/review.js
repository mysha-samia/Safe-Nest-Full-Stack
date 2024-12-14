const mongoose = require("mongoose");
const Schema =mongoose.Schema;

const reviewSchema = new Schema({
    comment: String,
    ratings: {
        type:Number,
        min:1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now,  // This sets the current date automatically
    },
    author:{
        type:Schema.Types.ObjectId,
        ref: "User",
    }
});

const Review = mongoose.model("reviews", reviewSchema);

module.exports = Review;

