let mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

let User = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    lastName : {
        type: String,
        required: true
    },
    email : {
        type: String,
        unique: true,
        required: true
    },
    phone : {
        type: String,
        unique: true,
        required: true
    },
    password : {
        type: String,
        required: true
    },
    networkCard : {
        type: String,
        unique: true,
        required: true
    },
    role : {
        type: String,
        required: false,
        default: "PARTICIPANT"
    }
});

module.exports = mongoose.model('User', User);