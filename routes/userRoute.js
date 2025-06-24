const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../datamodels/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const usercontroller=require("../controllers/userController.js");

//signup
router.get("/signup",usercontroller.signup);

//after submitting signup form
router.post("/signup", wrapAsync(usercontroller.submitSignup));

//login 
router.get("/login", usercontroller.login);

//after login 
router.post("/login", saveRedirectUrl,
    passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
    usercontroller.submitLogin);
    
//logout
router.get("/logout", usercontroller.logout);

module.exports = router;