const Listing = require("../models/listing");
const Review = require('../models/review');

module.exports.reviewRoot = async(req,res)=>{
    const {id} = req.params;
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
     await newReview.save();
     listing.review.push(newReview);
     await listing.save();
     req.flash("success","Your Review is Sent Successfully!")
     res.redirect(`/listings/${listing._id}`);
};
module.exports.deleteReview = async(req,res)=>{
    let {id,reviewId}= req.params;  
     // we have to go through the array of the lisitng 
    //and then we have to delete the review id from the listing array
    //pull operator will find the id and delete it from the lsiting
    await Listing.findByIdAndUpdate(id,{$pull:{ review: reviewId}});
     await Review.findByIdAndDelete(reviewId);
     req.flash ("success","Your Review is Deleted Successfully!")
     res.redirect(`/listings/${id}`);
  };
