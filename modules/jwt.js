'use strict';

const _ = require('lodash');
const jwt = require('jsonwebtoken');
const config = require('config').get('chain-pad');
const UserMongo = require("../modules/models/userMongo");

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
        return jwt.sign({data: this.encodeUserForJWT(user)._doc}, process.env.JWT_SECRET, {
            expiresIn: 259200,// expires in 180 days
            algorithm: 'HS256'
        });
    },
    verifyJWTToken: function (token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
                if (err || !decodedToken) {
                    return reject(err)
                }

                resolve(decodedToken)
            })
        })
    }
};