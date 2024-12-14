const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

//sign up route
router
  .route("/signup")
  .get((req, res) => {
    res.render("users/signUp");
  })
  .post(
    wrapAsync(async (req, res) => {
      try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, function (err) {
          if (err) {
            return next(err);
          }
          req.flash("success", "You are successfully logged in!");
          res.redirect("/listings");
        });
      } catch (error) {
        req.flash("error", error.message);
        res.redirect("/signup");
      }
    })
  );

//login route
router
  .route("/login")
  .get((req, res) => {
    res.render("users/login");
  })
  .post(
    saveRedirectUrl,
    //before the passport is authenticating our user we have to use the
    //redirecturl we saved in the locals
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    async (req, res) => {
      req.flash("success", "Welcome to Safe Nest!");
      let redirectUrl = res.locals.redirectUrl || "/listings";
      res.redirect(redirectUrl);
    }
  );

  
//logout route
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      next(err);
    }
    req.flash("success", "You are successfully logged out");
    res.redirect("/listings");
  });
});

module.exports = router;
