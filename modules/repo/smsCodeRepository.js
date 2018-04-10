let smsCode = require('../models/smsCodeModel');
let log = require('../logger');
const axios = require('axios');

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

    return axios({
        url: "https://api.smsglobal.com/http-api.php",
        method: "POST",
        responseType: 'json',
        params: {
            action: "sendsms",
            user: process.env.SMS_USER,
            password: process.env.SMS_PASSWORD,
            from: process.env.SMS_FROM,
            to: phone,
            text: "You activation code: " + text,
            //maxsplit: "",
            //scheduledatetime: "",
        }
    }).then(function (response) {
        return {success: response.data.indexOf("OK") > -1, message: response.data};
    })
};