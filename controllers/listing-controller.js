const Listing = require("../models/listing");
const mbxStyles = require('@mapbox/mapbox-sdk/services/styles');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient= mbxGeocoding({accessToken: mapToken});
module.exports.index = async (req, res, next) => {
  // Fetch all listings from the database

  const allListings = await Listing.find({});


  // Render the 'listings/index' template, passing allListings as context
  res.render("listings/index", { allListings });
};
module.exports.newListingRoute = async (req, res, next) => {
  res.render("listings/newListings");
};

module.exports.showListing = async (req, res, next) => {
  const { id } = req.params;
  //through populate we can access the info of the owner and review
  const listing = await Listing.findById(id)
    .populate({
      path: "review",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you have requested for does not exist!");
    res.redirect("/listings");
  }
  res.render("listings/show", { listing });
};
module.exports.createNewListing = async (req, res, next) => {
  //   if(!req.body.listing){
  //     throw new ExpressError(400,"send some valid data");
  //   }
let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location ,
    limit: 1
  }).send();
  //in response we get the full mapbox object and in object we have a body .we will access that. and in body we have the features,where we can access the 
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  //creating the owner of the individual listing as passport svaes the
  //user info in req.user and and the owners info in req.user._id
   newListing.owner = req.user._id;
   newListing.image = {url,filename};
   newListing.geometry = response.body.features[0]. geometry;
  let savedListing = await newListing.save();
  console.log(savedListing); 
  req.flash("success", "Your Listing has been Created successfully!");
  res.redirect("/listings");
};

module.exports.editListing = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you have requested for does not exist!");
    res.redirect("/listings");
  }
  let originalImgUrl =listing.image.url;
  originalImgUrl.replace("/upload","/upload/h_70,w_200");
  res.render("listings/edit", { listing , originalImgUrl});
};

module.exports.updateListing = async (req, res, next) => {
  const { id } = req.params;
 let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save();
  }
  
  req.flash("success", "Listing has been Updated Successfully!");
  res.redirect(`/listings/${id}`);
};
module.exports.deleteListing = async (req, res, next) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing has been Deleted Successfully!");
  res.redirect("/listings");
};
