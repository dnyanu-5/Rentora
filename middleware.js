const Listing = require("./datamodels/listing");
const Review = require("./datamodels/review.js");
const {listingSchema,reviewsSchema}= require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

module.exports.isLoggedIn = (req, res, next) => {
    console.log(req.user);
    if (!req.isAuthenticated()) {
        req.session.redirectUrl=req.originalUrl;  //to redirect
        req.flash("error", "You must be logged in");
        return res.redirect("/login");
    }
    next();
};
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};
//for edit and delete 
module.exports.isOwner = async(req, res, next) => {
    let{id} = req.params;
    let listings= await Listing.findById(id);
    if(!listings.owner.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of this listings.");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
//for review 
module.exports.isReviewAuthor = async(req, res, next) => {
    let{id,reviewId} = req.params;
    let review= await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of this review.");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListings = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        console.log("validation error", error.details);
        throw new ExpressError(400, error.details[0].message);
    } else {
        next();
    }
}

module.exports.validateReviews = (req, res, next) => {
    let { error } = reviewsSchema.validate(req.body);
    if (error) {
        console.log("validation error",error.details);
        throw new ExpressError(400, error.details[0].message);
    } else {
        next();
    }
}

