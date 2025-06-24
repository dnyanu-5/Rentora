const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../datamodels/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

//signup
router.get("/signup", (req, res) => {
    res.render("listings/signup.ejs");
});
//after submitting signup form
router.post("/signup", wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registerUser = await User.register(newUser, password);
        console.log(registerUser);

        req.login(registerUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "user registered successfully!");
            res.redirect("/listings");
        });
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}));

//login 
router.get("/login", (req, res) => {
    res.render("listings/login.ejs");
});
//after login 
router.post("/login", saveRedirectUrl,
    passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
    async (req, res) => {
        req.flash("success", "welcome back to Dnya-bnb..");
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
    });
//logout
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You successfully logged out.");
        res.redirect("/listings");
    });
});

module.exports = router;