const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required:true 
    },
    refreshToken: {
        type: String,
        required: false
    },
    googleId: {
        type: String,
        required: false 
    },
    facebookId: {
        type: String,
        required: false 
    },
    registerationToken: {
        type: String,
        required: false
    }, 
    isConfirmed: {
        type: Boolean,
        required: false,
        default: false
    }
});

module.exports = mongoose.model('User', userSchema);
