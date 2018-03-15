let smsCode = require('../models/smsCodeModel');
let log = require('../logger');

exports.add = phone => smsCode.create({phone}).then(result => result.code);
exports.get = (phone, code) => smsCode.findOne({phone: phone, code: code})
    .then(_phone => {
        if (_phone) {
            return Promise.resolve();
        } else {
            return Promise.reject("Code incorrect");
        }
    });
exports.remove = phone => smsCode.remove({phone});

exports.send = (phone, text) => {
    return Promise.resolve();
};