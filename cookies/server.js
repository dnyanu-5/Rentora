const express = require("express");
const app = express();
const port = 3000;
const session = require('express-session');
const flash = require('connect-flash');
const path = require("path");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));


app.use(session({ secret: "august", resave: false, saveUninitialized: true }));
app.use(flash());

app.listen(port, () => {
    console.log(`Server is running`);
});
//1
app.get("/check", (req, res) => {
    res.send("express-sessions!")
});
//2
app.get("/name", (req, res) => {
    let { name = "unknown" } = req.query;
    req.session.name = name;
    if (name === "unknown") {
        req.flash("error", "your name is not added!")
    } else {
        req.flash("popup", "your name is added!")
    }
    res.redirect("/hello");
});
// middleware 
app.use((req, res, next) => {
    res.locals.smsg = req.flash("popup");
    res.locals.err = req.flash("error");
    next();
});
app.get("/hello", (req, res) => {
    res.render("page.ejs", { name: req.session.name });
});
//3
app.get("/reqcount", (req, res) => {
    if (req.session.count) {
        req.session.count++;
    } else {
        req.session.count = 1;
    }
    res.send(`Your session count is:${req.session.count}`);
});