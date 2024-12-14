//here we will create the models
//thrn we will export the schema and will use them in our app.js

const mongoose = require("mongoose");
const Review = require("./review.js"); 
const Schema =mongoose.Schema;

const listingSchema = new Schema({
//here we will list the schema
title:{
    type: String,
    required:true,
},
description: {
    type: String,
    required:true,
},


  
image: {
    filename:{type:String},
    url:{type:String,
        
        default: "https://media.istockphoto.com/id/1453814314/photo/two-female-friends-enjoying-hot-drink-outside-of-cabin.jpg?s=2048x2048&w=is&k=20&c=yJ5VWoqZSXkEKX8JmDB_Swg-ZInrrk-Bx_KncIPUJaA=",
        set: (v)=>  
                v ==="" ? "https://media.istockphoto.com/id/1453814314/photo/two-female-friends-enjoying-hot-drink-outside-of-cabin.jpg?s=2048x2048&w=is&k=20&c=yJ5VWoqZSXkEKX8JmDB_Swg-ZInrrk-Bx_KncIPUJaA=":v,
    }
 },
  

price:{
    type: Number,
    required:true,
},
location:{
    type: String,
    required:true,
},
country:{
    type: String,
    required:true,
},
review:[
    {
        type: Schema.Types.ObjectId,
        ref: "reviews"
      }
],
owner:
    {
        type:Schema.Types.ObjectId,
        ref: "User",
    } ,
geometry:{
   
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        },
      },  
      
catagory :{
    type :{
        type: String,
        enum: ["trendings","mountains","rooms","villas","resorts","pools","lakes","arctics","beaches"]
    }
}      

});
//post mongoose middleware if we delete the listing it will delete the reviews too through their review id
//whenever app.delete listing delete will be called this middle ware will be called too
listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
 await Review.deleteMany({_id : {$in: listing.review}});
    }
});
//here we created a model named listing and we send the schema for the model
const Listing= mongoose.model("Listing",listingSchema);
//we have to export the model to the app.js file
module.exports=Listing; 