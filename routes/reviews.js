const express = require("express");
const router = express.Router({mergeParams:true});
const Listing = require("../datamodels/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressEror = require("../utils/ExpressError.js");
const Review = require("../datamodels/review.js");
const {isLoggedIn,isReviewAuthor,validateReviews}= require("../middleware.js");

// 11 review 
router.post("/", isLoggedIn, validateReviews, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.reviews);
    newReview.author=req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New Review is created..");
    res.redirect(`/listings/${listing._id}`);
}));
//12 delete reviews
router.delete("/:reviewId",isReviewAuthor,isLoggedIn,wrapAsync(async (req, res) => {
    let { id,reviewId } = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted..");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;