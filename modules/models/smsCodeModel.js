let mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    randomStr = require('randomstring');

let smsCodeSchema = new Schema({
    code: {
        type: String,
        default: () => randomStr.generate({length: 4, readable: true, charset: 'numeric'})
    },
    phone: {
        type: String,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 120
    }
});

module.exports = mongoose.model('smsCode', smsCodeSchema);