const express = require("express");
const cookieParser = require("cookie-parser"); // to parse the cookies

const app = express();
const port = 3000;

app.listen(port, () => {
    console.log(`Server is running`);
});

app.use(cookieParser("august"));

app.get("/", (req, res) => {
    console.dir(req.cookies);
    res.send("i am a root");
});

app.get("/getcookies", (req, res) => {
    res.cookie("name", "dnyanu");
    res.cookie("greet", "hello");
    res.send("Sent you a cookie! Don't eat it");
});

app.get("/showcookies", (req, res) => {
    res.send(req.cookies);
});

app.get("/color", (req, res) => {
    let{color="red"} = req.cookies;
    res.send(`Hi,${color}`);
});


//signes cookies --> correct cookie
app.get("/getsignedcookie", (req, res) => {
    res.cookie("made-in", "India",{signed:true});
    res.send("Sent you a signed cookie!");
});
app.get("/verify", (req,res)=>{
    res.send(req.signedCookies);
    console.log(req.signedCookies);
    // res.send("verified!");

});