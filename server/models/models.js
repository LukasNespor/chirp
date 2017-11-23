var mongoose = require("mongoose");

var postSchema = new mongoose.Schema({
    text: String,
    author: String,
    created: { type: Date, default: Date.now }
});

mongoose.model("Post", postSchema);