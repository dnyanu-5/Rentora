const Listing = require("../datamodels/listing.js");
const storage = require("../cloudConfig.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });




//index route
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    return res.render("listings/index.ejs", { allListings });
};
//new form
module.exports.renderNewForm = (req, res) => {
    return res.render("newform.ejs");
};
// individual listings
module.exports.showListings = async (req, res) => {
    let { id } = req.params;
    const lists = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" }, })
        .populate("owner");
    if (!lists) {
        req.flash("error", "Listing does not exist..");
        return res.redirect("/listings");
    }
    return res.render("listings/show.ejs", { lists });
}
//submit listing
module.exports.submitListing = async (req, res, next) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listings.location,
        limit: 1,
    })
    .send();
   
    let lists = req.body.listings;
    let newListing = new Listing(lists);
    newListing.owner = req.user._id;
    if (req.file) {
        newListing.img = {
            url: req.file.path,
            filename: req.file.filename
        };
    }
    newListing.geometry=response.body.features[0].geometry;
    let saveListing= await newListing.save();
    console.log(saveListing);
    req.flash("success", "New Listing is created..");
    return res.redirect("/listings");
};

//edit 
module.exports.edit = async (req, res) => {
    let { id } = req.params;
    const lists = await Listing.findById(id);
    if (!lists) {
        req.flash("error", "Listing does not exist..");
        return res.redirect("/listings");
    }
    let originalImageUrl = lists.img.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_200/e_blur:300");
    return res.render("listings/editform.ejs", { lists, originalImageUrl });
};
//update
module.exports.update = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, req.body, { new: true });
    if (req.file) {
        listing.img = {
            url: req.file.path,
            filename: req.file.filename
        };
        await listing.save();
    }
    req.flash("success", "Listing updated..");
    return res.redirect(`/listings/${id}`);
};
//delete
module.exports.delete = async (req, res) => {
    let { id } = req.params;
    const deleteListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing is deleted..");
    return res.redirect("/listings");
};
