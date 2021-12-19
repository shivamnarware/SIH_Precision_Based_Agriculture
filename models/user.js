const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
    username: String,
    password: String
});
//add bunch of methods to user Schema
UserSchema.plugin(passportLocalMongoose);


module.exports = mongoose.model("User", UserSchema);