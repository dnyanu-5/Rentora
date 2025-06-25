const express = require("express");
const router = express.Router();
const Listing = require("../datamodels/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn, isOwner, validateListings } = require("../middleware.js");
const listingcontroller = require("../controllers/listingController.js");
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

//Here we dont have access of app hence we are using router instead of app.get/post...
// we use router.route for more compact version

// step 4  ejs setup and index route 
router.route("/")
    .get(wrapAsync(listingcontroller.index))
    .post(isLoggedIn, upload.single("image"), validateListings,
        wrapAsync(listingcontroller.submitListing));

// 6 create new lists
router.get("/new", isLoggedIn, listingcontroller.renderNewForm);

// step 5 show route read individual place 
router.route("/:id")
    .get(wrapAsync(listingcontroller.showListings))
    .put(isLoggedIn, isOwner, wrapAsync(listingcontroller.update))
    .delete(isLoggedIn, isOwner, wrapAsync(listingcontroller.delete))

// 8 edit route
router.get("/:id/edit", isLoggedIn, isOwner,
    wrapAsync(listingcontroller.edit));

module.exports = router;