const express = require("express");
const router = express.Router();
const Listing = require("../datamodels/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressEror = require("../utils/ExpressError.js");
const { isLoggedIn, isOwner ,validateListings} = require("../middleware.js");


//Here we dont have access of app hence we are using router instead of app.get/post...
// step 4  ejs setup and index route 
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

// 6 create new lists
router.get("/new", isLoggedIn, (req, res) => {
    res.render("newform.ejs");
});

// step 5 show route read individual place 
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const lists = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" }, })
        .populate("owner");
    if (!lists) {
        req.flash("error", "Listing does not exist..");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { lists });
}));
// 7 submit list route
router.post("/", isLoggedIn, validateListings, wrapAsync(async (req, res, next) => {
    let lists = req.body.listings;
    let newListing = new Listing(lists);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing is created..");
    res.redirect("/listings");
}));
// 8 edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const lists = await Listing.findById(id);
    if (!lists) {
        req.flash("error", "Listing does not exist..");
        return res.redirect("/listings");
    }
    res.render("listings/editform.ejs", { lists });
}));
//9 update
router.put("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, req.body, { new: true });
    req.flash("success", "Listing updated..");
    res.redirect(`/listings/${id}`);
}));
//10 delete listings 
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const deleteListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing is deleted..");
    res.redirect("/listings");
}));

module.exports = router;