let mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

let User = new mongoose.Schema({
    name: {
        type: String,
        required: false
    },
    lastName: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        unique: true,
        required: true
    },
    networkCard: {
        type: String,
        unique: true,
        required: true
    },
    role: {
        type: String,
        required: false,
        default: "PARTICIPANT"
    }
});

module.exports = mongoose.model('User', User);