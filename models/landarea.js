const mongoose = require("mongoose");


const areaSchema = new mongoose.Schema({
    cropname: String,
    season: String,
    production: String

});
module.exports = mongoose.model("Area", areaSchema);