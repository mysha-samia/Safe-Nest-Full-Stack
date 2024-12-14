const express = require ("express");
//listing is the parent route and the parameter of listing is being used in the rview.for that we have to use merge params
const router = express.Router({mergeParams :true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const {reviewSchema} =require("../schema.js")
const Listing = require("../models/listing");
const Review = require('../models/review');
const {isLoggedIn,isAuthor } = require ("../middleware.js");

const reviewController = require ("../controllers/review-controller.js");




//for review
const validationReviewSchema =(req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error)  {
      let errMsg =error.details.map((el)=>el.message).join(",");
      console.log("Validation Error:", errMsg); 
      return next(new ExpressError(400, errMsg));
    }else{
      next();
    }  
  };

  

//page for reviews
router.post("/", isLoggedIn ,validationReviewSchema,wrapAsync(reviewController.reviewRoot));
//to delete the reviews
router.delete("/:reviewId",isLoggedIn,isAuthor, wrapAsync(reviewController.deleteReview));
module.exports= router;