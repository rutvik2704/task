const mongoose = require("mongoose");


const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
        
    },
    body: {
        type: String,
        required: true
    },
    createdby: {
        type: mongoose.Schema.Types.ObjectId
    },
    isActive: {
        type: Boolean,
        default: false
    },
    lat: {
        type: Number,
        required: true
    },
    long: {
        type: Number,
        required: true
    }
})
const PostUser = new mongoose.model("post", postSchema);
module.exports = PostUser;

