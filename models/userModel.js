const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
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
    },
    role: {
        type: String,
        enum: ['ADMIN', 'EDITOR', 'AUTHOR', 'SUBSCRIBER'],
        default: 'SUBSCRIBER'
    }
});

module.exports = mongoose.model('User', userSchema);


// Example roles object
const roles = {
    admin: {
        can: ['create', 'read', 'update', 'delete', 'manageUsers']
    },
    editor: {
        can: ['create', 'read', 'update', 'delete']
    },
    author: {
        can: ['create', 'read', 'update']
    },
    subscriber: {
        can: ['read', 'comment']
    }
};
