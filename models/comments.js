var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
    text: String,
    created: { type: Date, default: Date.now },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    reply: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Reply"
        }]
});
module.exports = mongoose.model("Comment", commentSchema);