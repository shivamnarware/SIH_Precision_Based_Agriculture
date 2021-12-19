var mongoose = require("mongoose");


var crophealthSchema = new mongoose.Schema({
    cropname: String,
    season: String,
    production: String

});
module.exports = mongoose.model("Crophealth", crophealthSchema);