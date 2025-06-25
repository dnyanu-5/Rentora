if(process.env.NODE_ENV !="production"){
require('dotenv').config();
}
// console.log(process.env.API_SECRET) ;

// step 1 basic setup 
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
app.set("view engine", "ejs");
const methodOverride = require("method-override");

const listings = require("./routes/listings.js");
const reviews = require("./routes/reviews.js");
const userRoute = require("./routes/userRoute.js");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./datamodels/user.js");

app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Add this middleware in your `app.js` file before routes
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(methodOverride('_method'));  // Use this middleware after body parsing
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const session = require('express-session');
const flash = require('connect-flash');

const sessionOptions = {
    secret: "august",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

app.listen(9000, () => {
    console.log("server is listening...");
})
app.get("/", (req, res) => {
    res.send("i am root");
})


app.use((req, res, next) => {
  const oldRender = res.render;
  res.render = function (...args) {
    if (res.headersSent) {
      console.log("⚠️  HEADERS ALREADY SENT - render called again!");
    }
    return oldRender.apply(res, args);
  };

  const oldRedirect = res.redirect;
  res.redirect = function (...args) {
    if (res.headersSent) {
      console.log("⚠️  HEADERS ALREADY SENT - redirect called again!");
    }
    return oldRedirect.apply(res, args);
  };

  next();
});


app.use(session(sessionOptions));
app.use(flash());

//passport for authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

//database
main().then((res) => {
    console.log("database is connected...");
}).catch((err) => {
    console.log(err);
})
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/airbnbDB');
}

//step 3 --> init folder 

// listings routes 
app.use("/listings", listings);
// reviews routes
app.use("/listings/:id/reviews", reviews);
//user routes
app.use("/", userRoute);

// wrong path error
app.all("*splate", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});
// middleware to handle error 
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    let { status = 500, message = "some error" } = err;
    // res.status(status).send(message);
    res.render("listings/error.ejs", { err });
});



