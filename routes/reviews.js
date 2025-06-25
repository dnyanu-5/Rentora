const express = require("express");
const router = express.Router({mergeParams:true});
const Listing = require("../datamodels/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../datamodels/review.js");
const {isLoggedIn,isReviewAuthor,validateReviews}= require("../middleware.js");
const reviewcontroller=require("../controllers/reviewController.js");

// 11 create review 
router.post("/", isLoggedIn, validateReviews, wrapAsync(reviewcontroller.createReview));

//12 delete reviews
router.delete("/:reviewId",isReviewAuthor,isLoggedIn,wrapAsync(reviewcontroller.destroyReview));

module.exports = router;