// step 3 initializing databse 
const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../datamodels/listing.js");

main().then((res) => {
    console.log("database is connected...");
}).catch((err) => {
    console.log(err);
})
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/airbnbDB');
}

const indata = async () => {
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj) => ({ ...obj, owner: "685a3dde7a1c2ef2428c645c" }));
    await Listing.insertMany(initdata.data);
    console.log("data is initialized..");
}
indata();