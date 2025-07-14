const User = require("../datamodels/user.js");

//signup form
module.exports.signup = (req, res) => {
    res.render("listings/signup.ejs");
};

//submit signup
module.exports.submitSignup = async (req, res,next) => {
    
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registerUser = await User.register(newUser, password);
        console.log(registerUser);
        
        req.login(registerUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "user registered successfully!");
            return res.redirect("/listings");
        });
    } catch (err) {
        req.flash("error", err.message);
        return res.redirect("/signup");
    }
};
//login form
module.exports.login = (req, res) => {
    return res.render("listings/login.ejs");
};
//submit login
module.exports.submitLogin = async (req, res) => {
    req.flash("success", "welcome back to Dnya-bnb..");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    return res.redirect(redirectUrl);
};
//logout
module.exports.logout=(req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You successfully logged out.");
        return res.redirect("/listings");
    });
};