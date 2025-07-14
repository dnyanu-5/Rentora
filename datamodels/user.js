const { string, required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email:{
        type:String,
        required:true
    },
    googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  username: String,
});

UserSchema.plugin(passportLocalMongoose);  // automatically define username and password and some methods

module.exports = mongoose.model('User', UserSchema);