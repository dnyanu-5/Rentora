const express = require("express");
const router = express.Router();
const Listing = require("../datamodels/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressEror = require("../utils/ExpressError.js");
const { isLoggedIn, isOwner ,validateListings} = require("../middleware.js");
const listingcontroller=require("../controllers/listingController.js");

//Here we dont have access of app hence we are using router instead of app.get/post...

// step 4  ejs setup and index route 
router.get("/", wrapAsync(listingcontroller.index));

// 6 create new lists
router.get("/new", isLoggedIn, listingcontroller.renderNewForm);

// step 5 show route read individual place 
router.get("/:id", wrapAsync(listingcontroller.showListings));

// 7 submit list route
router.post("/", isLoggedIn, validateListings, wrapAsync(listingcontroller.submitListing));

// 8 edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingcontroller.edit));

//9 update
router.put("/:id", isLoggedIn, isOwner, wrapAsync(listingcontroller.update));

//10 delete listings 
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingcontroller.delete));

module.exports = router;