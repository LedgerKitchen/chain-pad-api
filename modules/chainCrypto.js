const fs = require('fs');
const crypto = require('crypto'),
    algorithm = process.env.CHAINPAD_CRYPTO_ALGHORITM,
    password = process.env.CHAINPAD_CRYPTO_PASSWORD;

module.exports = {
    encryptBuffer: function (buffer) {
        let cipher = crypto.createCipher(algorithm, password);

        return Buffer.concat([cipher.update(buffer), cipher.final()]);
    },
    decryptBuffer: function (buffer) {
        let decipher = crypto.createDecipher(algorithm, password);

        return Buffer.concat([decipher.update(buffer), decipher.final()]);
    },
    encryptText: function (text) {
        let cipher = crypto.createCipher(algorithm, password);
        let crypted = cipher.update(text, 'utf8', 'hex');
        crypted += cipher.final('hex');
        return crypted;
    },
    decryptText: function (text) {
        let decipher = crypto.createDecipher(algorithm, password);
        let dec = decipher.update(text, 'hex', 'utf8');
        dec += decipher.final('utf8');
        return dec;
    },
    crc: function (data, algorithm, encoding) {
        return crypto
            .createHash(algorithm || 'sha256')
            .update(data, 'utf8')
            .digest(encoding || 'hex')
    }
};