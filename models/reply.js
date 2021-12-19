const mongoose = require("mongoose");


const replySchema = new mongoose.Schema({
    text: String,
    created: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Reply", replySchema);