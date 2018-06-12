const _ = require('lodash');
const JWT = require('jsonwebtoken');
const config = require('config').get('chain-pad');

module.exports = {
    encodeUserForJWT: function (user) {
        return _.reduce(user || {}, (memo, val, key) => {
            if (typeof val !== "function" && key !== "password") {
                memo[key] = val
            }
            return memo
        }, {})
    },
    createJWToken: function (user) {
        return JWT.sign({data: this.encodeUserForJWT(user)._doc}, process.env.JWT_SECRET, {
            expiresIn: (2592000 * 12),// expires in 180 days
            algorithm: 'HS256'
        });
    },
    verifyJWTToken: function (token) {
        return new Promise((resolve, reject) => {
            JWT.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
                if (err || !decodedToken) {
                    return reject(err)
                }

                resolve(decodedToken)
            })
        })
    }
};