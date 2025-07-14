const express = require('express');
const passport = require('passport');
const router = express.Router();

// Start Google login
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback after Google login
router.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: "/login",
    failureFlash: true
  }),
  (req, res) => {
    console.log("google user:",req.user);
    req.flash("success", `Welcome back, ${req.user.username}!`);
    res.redirect("/listings");
  }
);

module.exports = router;
