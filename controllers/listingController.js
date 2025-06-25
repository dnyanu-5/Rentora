const Listing = require("../datamodels/listing.js");
const storage =require("../cloudConfig.js");
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
    try {
        let lists = req.body.listings;
        let newListing = new Listing(lists);
        newListing.owner = req.user._id;
         if (req.file) {
            newListing.img = {
                url: req.file.path,
                filename: req.file.filename
            };
        }
        await newListing.save();
        req.flash("success", "New Listing is created..");
        return res.redirect("/listings");
    } catch (err) {
        next(err);
    }
};

//edit 
module.exports.edit = async (req, res) => {
    let { id } = req.params;
    const lists = await Listing.findById(id);
    if (!lists) {
        req.flash("error", "Listing does not exist..");
        return res.redirect("/listings");
    }
    return res.render("listings/editform.ejs", { lists });
};
//update
module.exports.update = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, req.body, { new: true });
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
