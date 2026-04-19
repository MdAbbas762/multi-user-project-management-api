const mongoose = require('mongoose');
const { minLength, maxLength } = require('zod');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 100
    }, 

    description: {
        type: String,
        required: true,
        trim: true,
        minLength: 10,
        maxLength: 1000
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            default: []
        }
    ]
});

const projectModel = mongoose.model('Project', projectSchema);

module.exports = projectModel;