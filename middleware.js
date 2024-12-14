const {listingSchema} =require("./schema.js")
const Listing = require("./models/listing");
 const Review = require ("./models/review.js");
 
 
 
 
 module.exports. isLoggedIn = (req,res,next)=>{
    // console.log(req.path,"...",req.originalUrl);
if(!req.isAuthenticated()){
    req.session.redirectUrl = req.originalUrl;
    req.flash("error","You must be log in first");
   return  res.redirect("/login");
}
next();
};
//if we try to access the redirectUrl , tha passport would delete it
//so if we want to access it we have to save it to the passport and we can save it to the passport through locals 
//and the locals have acces through the sessions
//so if we have any redirecturl in our session we have to save it in our locals
module.exports.saveRedirectUrl =(req,res,next )=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req,res,next)=>{
    const { id } = req.params;
    //we will match if the user has created the lsiting and who has updated the listing are the same
   let listing =  await  Listing.findById(id);
   if( !listing.owner.equals(res.locals.currUser._id)  ){
    req.flash("error", "You don't have access to this listing!");
   return res.redirect(`/listings/${id}`);
   };
   next();
};
module.exports.isAuthor = async (req,res,next)=>{
    let {id,reviewId}= req.params;  
    //we will match if the user has created the lsiting and who has updated the listing are the same
   let review =  await Review.findById(reviewId);
   if( ! review.author.equals(res.locals.currUser._id)  ){
    req.flash("error", "You don't have the access!");
   return res.redirect(`/listings/${id}`);
   };
   next();
};




