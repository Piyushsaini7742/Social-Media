const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: String,
    image: String,
    likes: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }],
    comments: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, test: String }],
    createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Post', postSchema);