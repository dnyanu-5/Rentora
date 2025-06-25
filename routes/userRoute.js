const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../datamodels/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const usercontroller = require("../controllers/userController.js");

//signup
router.route("/signup")
    .get(usercontroller.signup)
    .post(wrapAsync(usercontroller.submitSignup));

//login 
router.route("/login")
    .get(usercontroller.login)
    .post(saveRedirectUrl,
        passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
        usercontroller.submitLogin);

//logout
router.get("/logout", usercontroller.logout);

module.exports = router;