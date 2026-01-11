if (process.env.NODE_ENV != "production") {
  require('dotenv').config();
}
// console.log(process.env.ATLASDB_URL) ;
// step 1 basic setup 
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const GoogleStrategy = require('passport-google-oauth20').Strategy;


app.set("view engine", "ejs");
const methodOverride = require("method-override");

const listings = require("./routes/listings.js");
const reviews = require("./routes/reviews.js");
const userRoute = require("./routes/userRoute.js");
const GoogleRoute = require("./routes/googleRoute.js");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./datamodels/user.js");

app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(methodOverride('_method'));  // Use this middleware after body parsing
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');

//mongo store for session store 
const dbURL = process.env.ATLASDB_URL;
const store = MongoStore.create({
  mongoUrl: dbURL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log("error in mongo session", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
};
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
})

app.use(session(sessionOptions));
app.use(flash());

//passport for authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

// login with google 
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:9000/auth/google/callback"
},
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });

      if (!user) {
        user = new User({
          username: profile.displayName,
          googleId: profile.id,
          email: profile.emails?.[0]?.value || 'no-email@google.com',
        });
        await user.save();
      }

      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

//database
// const mongoURL="mongodb://127.0.0.1:27017/airbnbDB";
main().then((res) => {
  console.log("Mongo-db connected...");
}).catch((err) => {
  console.log(err);
})
async function main() {
  await mongoose.connect(dbURL);
}

// listings routes 
app.use("/listings", listings);
// reviews routes
app.use("/listings/:id/reviews", reviews);
//user routes
app.use("/", userRoute);
//google route 
app.use("/", GoogleRoute);

app.get("/", (req, res) => {
  res.redirect("/listings");
});

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



