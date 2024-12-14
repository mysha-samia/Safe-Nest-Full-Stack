// //here we will tackle our listing for validation not the individual fields
// //this schema is for server side validation schema
// const Joi =  require("joi");
// module.exports.listingSchema = Joi.object({
//     listing:Joi.object({
//         title: Joi.string().required,
//         description: Joi.string().required,
//         image: Joi.string().allow("",null),
//         price:Joi.number().required().min(0),
//         location:Joi.string().required,
//         country:Joi.string().required,

//     }).required() 
// });
// module.exports.reviewSchema=Joi.object({
//     review: Joi.object({
//         comment: Joi.string().required(),
//         ratings:Joi.number().required().min(1).max(5),
//     }).required(),
// }).required();


const Joi = require("joi");

// Listing schema for server-side validation
module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(), // Add parentheses to `required`
    description: Joi.string().required(), // Add parentheses to `required`
    image: Joi.string().allow("", null), // This is fine as it allows empty or null strings
    price: Joi.number().required().min(0), // Add parentheses to `required`
    location: Joi.string().required(), // Add parentheses to `required`
    country: Joi.string().required(), // Add parentheses to `required`
  }).required(), // Ensure the `listing` object itself is required
});

// Review schema for server-side validation
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    comment: Joi.string().required(), // Add parentheses to `required`
    ratings: Joi.number().required().min(1).max(5), // Add parentheses to `required`
  }).required(), // Ensure the `review` object itself is required
}).required();
