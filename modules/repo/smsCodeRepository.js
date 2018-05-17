let smsCode = require('../models/smsCodeModel');
let log = require('../logger');
const axios = require('axios'),
    request = require('request-promise');
randomStr = require('randomstring'),
    crypto = require("crypto");


function SmsGlobalApi(key, secret, protocol, host, port, apiVersion, extraData, debug, type) {
    let TYPE_JSON = "application/json"
    let TYPE_XML = "application/xml"
    let TYPE_YAML = "application/x-yaml"
    let TYPE_CSV = "text/csv"
    let TYPE_MSGPACK = "application/x-msgpack"
    let ALGORITHM = "sha256"
    let self = this;

    self.key = key.trim();
    self.secret = secret.trim();
    self.protocol = typeof protocol !== 'undefined' ? protocol.trim() : 'https';
    self.host = typeof host !== 'undefined' ? host.trim() : 'api.smsglobal.com';
    self.port = typeof port !== 'undefined' ? port : 443;
    self.apiVersion = typeof apiVersion !== 'undefined' ? apiVersion.trim() : 'v2';
    self.extraData = typeof extraData !== 'undefined' ? extraData.trim() : '';
    self.debug = typeof debug !== 'undefined' ? debug : false;
    self.type = typeof type !== 'undefined' ? type : TYPE_JSON;

    self.get = function (action, id, callback) {
        return self.connect("GET", action, id, null, callback);
    };

    self.post = function (action, id, body, callback) {
        return self.connect("POST", action, id, body, callback);
    };

    self.delete = function (action, id, callback) {
        return self.connect("DELETE", action, id, callback);
    };

    self.connect = function (method, action, id, body, callback) {
        action = format('/{0}/{1}/', self.apiVersion, action);

        if (id)
            action = format("{0}/id/{1}/", action, id);

        method = method.toUpperCase();
        // Set up request metadata
        if (method !== "GET" && method !== "POST" && method !== "DELETE" && method !== "OPTIONS" && method !== "PATCH")
            method = "GET";

        let headers = {
            "Authorization": get_authorisation_http_header(method, action),
            "User-Agent": "SMS Node Client",
            "Accept": self.type
        };
        let options = {url: "https://" + self.host + action, headers: headers, method: method, json: body};


        return request(options);

    };

    function get_authorisation_http_header(method, action) {
        let hash, hmac;
        let timestamp = parseInt(new Date().getTime() / 1000);

        let nonce = random();
        let raw = timestamp + "\n" + nonce + "\n" + method + "\n" + action + "\n" + self.host + "\n" + self.port + "\n" + self.extraData + "\n";
        // Encryptions
        hash = crypto.createHmac('sha256', self.secret).update(raw).digest('base64');
        mac = format('MAC id="{0}",ts="{1}",nonce="{2}",mac="{3}"', key, timestamp, nonce, hash);

        return mac;
    }

    function format(format) {
        let args = Array.prototype.slice.call(arguments, 1);
        return format.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    }

    function random() {
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (let i = 0; i < 25; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }
}


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
    let sms = new SmsGlobalApi(process.env.SMS_API_KEY, process.env.SMS_API_SECRET_KEY);

    return sms.post('sms', null, {
        destination: phone,
        message: "You activation code: " + text
    }).then(function (response) {
        return {
            success: response.messages.length > 0,
            message: 'Sms has been sent'
        };
    }).catch(function (error) {
        return {
            success: false,
            message: error.toString()
        };
    });
};
