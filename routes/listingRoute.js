const express = require ("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const {listingSchema} =require("../schema.js")
const Listing = require("../models/listing");
const {isLoggedIn} = require("../middleware.js");
const {isOwner} =require("../middleware.js");
const listingController = require ("../controllers/listing-controller.js");
const multer = require ("multer");
const {storage} = require ("../cloudinaryConfig.js");
const upload = multer ({storage});
 //this is how multer will save the files in the storage of cloudinary



//we can use validationschema as middleware
//for server side validations
//for listings
const validationSchema=(req,res,next)=>{
    let {error}= listingSchema.validate(req.body);  
    if(error)  {
      let errMsg =error.details.map((el)=>el.message).join(",")
    //  throw new ExpressError(400,errMsg);
    console.log("Validation Error:", errMsg); 
    return next(new ExpressError(400, errMsg));
    }else{
      next();
    }
  };
  
//New Route
router.get("/new",isLoggedIn,  wrapAsync(listingController.newListingRoute));

  //router.router() express method which combines all the routes
  router.route("/")
  //index route
  .get( wrapAsync( listingController.index))
  //creating new route 
  .post(isLoggedIn,upload.single("listing[image]"),
  wrapAsync(listingController.createNewListing));
 
  router.route("/:id")
  //show route
  .get(wrapAsync(listingController.showListing))
  //update route
  .put(isLoggedIn,isOwner, upload.single("listing[image]"),wrapAsync(listingController.updateListing))
  //delete route 
  .delete(isLoggedIn,isOwner, wrapAsync(listingController.deleteListing));

//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.editListing)
);




module.exports = router;