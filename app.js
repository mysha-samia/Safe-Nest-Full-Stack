if (process.env.NODE_ENV !="production"){
  require("dotenv").config();

}

const express = require("express");
const app = express();
const helmet = require("helmet");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const crypto = require("crypto");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/expressError.js");
const { listingSchema } = require("./schema.js");
const listingRoute = require("./routes/listingRoute.js");
const reviewRoute = require("./routes/reviewRoutes.js");
const userRoute = require("./routes/userRoute.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const passportLocalMongoose = require("passport-local-mongoose");
const User = require("./models/user.js");


// const databaseURL = "mongodb://127.0.0.1:27017/wanderlust";
const databaseURL =
  "mongodb+srv://2020952:3WEkJKmzzGvZBw64@cluster0.24xqp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Connect to the database
async function main() {
  try {
    await mongoose.connect(databaseURL);
    console.log("Database is connected");
  } catch (err) {
    console.error("Database connection error:", err);
  }
}

main();








// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static('public'));  







// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");








app.use(
  helmet.crossOriginResourcePolicy({
    policy: 'cross-origin',
    directives: {
      defaultSrc: ["'self'", "*"],
      imgSrc: ["'self'", "data:", "*", "https://api.mapbox.com", "https://assets.mapbox.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://api.mapbox.com", "https://assets.mapbox.com"],

      styleSrcElem: [
        "'self'",
        "https://cdn.jsdelivr.net",
        "https://cdnjs.cloudflare.com",
        "https://api.mapbox.com", // Allow Mapbox styles
        "https://assets.mapbox.com" // Allow Mapbox styles
      ], // Allow external stylesheets
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://api.mapbox.com"],
      scriptSrcElem: ["'self'", "https://cdn.jsdelivr.net", "https://api.mapbox.com"], // Allow external scripts
      connectSrc: ["'self'", "https://api.mapbox.com"], // Allow Mapbox API requests
    },
    reportOnly: true,
  })
);














// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: ["'self'", "*"],
//       imgSrc: ["'self'", "data:", "*"],
//       styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],

//       styleSrcElem: [
//         "'self'",
//         "https://cdn.jsdelivr.net",
//         "https://cdnjs.cloudflare.com",
//       ], // Allow external stylesheets
//       scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
//       scriptSrcElem: ["'self'","https://cdn.jsdelivr.net"], // Allow external scripts;
//     },
//   })
// );
// console.log(process.env.MAP_TOKEN);
// app.use((err, req, res, next) => {
//   console.error("Error details:", err); // Log full error details
//   const { statusCode = 500, message = "Something went wrong" } = err;
//   res.status(statusCode).render("error", { message });
// });

const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.successMsg = req.flash("success");
  res.locals.errorMsg = req.flash("error");
  res.locals.currUser = req.user;
  next();
});
//passport configuration
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//we can use validationschema as middleware
//for server side validations
//for listings
const validationSchema = (req, res, next) => {
  // let {error}= listingSchema.validate(req.body);
  // if(error)  {
  //   let errMsg =error.details.map((el)=>el.message).join(",")
  // //  throw new ExpressError(400,errMsg);
  // console.log("Validation Error:", errMsg);
  // return next(new ExpressError(400, errMsg));
  // }else{
  next();
  // }
};

// Routes
//root route
// app.get(
//   "/",
//   validationSchema,
//   wrapAsync(async (req, res, next) => {
//     // res.send("Welcome to Wanderlust!");
//     res.json({ message: "success" });
//   })
// );

//listing Routes
app.use("/listings", listingRoute);
//review Routes
app.use("/listings/:id/review", reviewRoute);
//signup
app.use("/", userRoute);

//page not found
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});
//handling errors
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrong" } = err;
  // res.status(statusCode).send(message);
  // res.send("something went wrong!");
  // next(err);
  res.status(statusCode).render("error.ejs", { message });
});

// Start server
app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
