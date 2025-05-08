const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: String,
    eamil: String,
    password: String,
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
})
module.exports = mongoose.model('User', userSchema);