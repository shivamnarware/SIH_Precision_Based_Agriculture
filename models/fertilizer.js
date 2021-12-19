const mongoose = require("mongoose");


const fertilzerSchema = new mongoose.Schema({
    soiltype: String,
    nitrogen: String,
    phosphorus: String,
    potassium: String,
    fertilzer: String


});
module.exports = mongoose.model("fertlizer", fertilzerSchema);