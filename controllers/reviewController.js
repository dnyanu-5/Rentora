const Listing = require("../datamodels/listing.js");
const Review = require("../datamodels/review.js");
const ExpressError = require("../utils/ExpressError.js");
//create review
module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.reviews);
    newReview.author = req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "New Review is created..");
    return res.redirect(`/listings/${listing._id}`);
};
//delete review
module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted..");
    return res.redirect(`/listings/${id}`);
};