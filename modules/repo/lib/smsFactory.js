const request = require('request-promise'),
    crypto = require("crypto");


module.exports = {
    init: function () {
        switch (process.env.SMS_CONNECTOR) {
            case 'US':
                return new this.smsUS(process.env.SMS_API_KEY, process.env.SMS_API_SECRET_KEY);
            case 'RUS':
            default:
                return new this.smsRUS(process.env.SMS_USER_RUS, process.env.SMS_PASSWORD_RUS);
        }
    },
    smsUS: function smsUS(key, secret, protocol, host, port, apiVersion, extraData, debug, type) {
        let TYPE_JSON = "application/json";
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

        self.send = function (body) {
            return self.connect("POST", 'sms', body);
        };

        self.connect = function (method, action, body) {

            return request({
                url: "https://" + self.host + action, headers: {
                    "Authorization": get_authorisation_http_header(method, format('/{0}/{1}/', self.apiVersion, action)),
                    "User-Agent": "SMS Node Client",
                    "Accept": self.type
                }, method: method.toUpperCase(), json: body
            });
        };

        function get_authorisation_http_header(method, action) {
            let hash,
                hmac,
                timestamp = parseInt(new Date().getTime() / 1000),
                nonce = random(),
                raw = timestamp + "\n" + nonce + "\n" + method + "\n" + action + "\n" + self.host + "\n" + self.port + "\n" + self.extraData + "\n";

            // Encryptions
            hash = crypto.createHmac('sha256', self.secret).update(raw).digest('base64');
            hmac = format('MAC id="{0}",ts="{1}",nonce="{2}",mac="{3}"', key, timestamp, nonce, hash);

            return hmac;
        }

        function format(format) {
            let args = Array.prototype.slice.call(arguments, 1);
            return format.replace(/{(\d+)}/g, function (match, number) {
                return typeof args[number] !== 'undefined'
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
    },
    smsRUS: function smsRUS(user, password) {
        let self = this;

        self.send = function (body) {
            return request({
                url: "https://web.smsgold.ru/http2/",
                method: "post",
                body: {
                    action: 'send',
                    user: user,
                    pass: password,
                    sender: process.env.SMS_FROM,
                    number: body.destination,
                    text: body.message
                },
                json: true
            });
        };
    }
};