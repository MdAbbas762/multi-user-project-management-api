const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    name: {
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

    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }, 

    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    }
});

const taskModel = mongoose.model('Task', taskSchema);

module.exports = taskModel;