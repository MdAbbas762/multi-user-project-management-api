const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 50
    },

    age: {
        type: Number,
        required: true,
        min: 13,
        max: 80
    },

    email: {
        type: String,
        required: true,
        trim: true,
    },

    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 8,
        maxLength: 100
    },

    role: {
        type: String,
        trim: true,
        default: 'user'
    }
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;