var mongoose = require("mongoose");

var ArticleSchema = new mongoose.Schema({
    user: mongoose.Schema.Types.ObjectId,
    title: String,
    content: Object, 
})

module.exports = mongoose.model("Article", ArticleSchema);