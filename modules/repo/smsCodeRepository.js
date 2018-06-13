let smsCode = require('../models/smsCodeModel');
let log = require('../CPLogger');
const
    smsFactory = require('./lib/SMSFactory'),
    axios = require('axios'),
    request = require('request-promise'),
    randomStr = require('randomstring'),
    crypto = require("crypto");


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

exports.send = (phone, text, connector) => {
    let sms = smsFactory.init(connector);

    return sms.send({
        destination: phone,
        message: "You activation code: " + text
    }).then(function (response) {

        let result = false;
        if (response.message) {
            result = response.message.length > 0
        } else {
            result = response.length > 0;
        }
        return {
            success: result,
            message: 'Sms has been sent'
        };
    }).catch(function (error) {
        console.error("SMS Error -->" + error.toString());
        return {
            success: false,
            message: "SMS Error -->" + error.toString()
        };
    });
};
