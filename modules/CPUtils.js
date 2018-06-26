'use strict';

const fs = require('fs');
const path = require('path');
const axios = require('axios');

module.exports = {
    ucFirst: function (string) {
        return string.charAt(0).toUpperCase() + string.substr(1).toLowerCase();
    },
    parseErrorHLF: function (error) {
        try {
            if (this.extractJSON(error) !== null) {
                return this.extractJSON(error).message || this.extractJSON(error).toString();
            } else {
                let arString;

                if (error.indexOf('[Error:') > -1) {
                    arString = error.split('[Error:');
                } else if (error.indexOf('[AccessException:') > -1) {
                    arString = error.split('[AccessException:');
                } else if (error.indexOf('failure:') > -1) {
                    arString = error.split('failure:');
                }

                if (arString[1]) {
                    let arString2 = arString[1].split(']');
                    return arString2[0];
                } else {
                    return error;
                }
            }
        } catch (e) {
            return error;
        }
    },
    extractJSON: function (str) {
        let firstOpen, firstClose, candidate, res;
        firstOpen = str.indexOf('{', firstOpen + 1);
        do {
            firstClose = str.lastIndexOf('}');
            if (firstClose <= firstOpen) {
                return null;
            }
            do {
                candidate = str.substring(firstOpen, firstClose + 1);
                try {
                    res = JSON.parse(candidate);
                    return res;
                }
                catch (e) {
                }
                firstClose = str.substr(0, firstClose).lastIndexOf('}');
            } while (firstClose > firstOpen);
            firstOpen = str.indexOf('{', firstOpen + 1);
        } while (firstOpen !== -1);
    },
    extractArray: function (str) {
        let firstOpen, firstClose, candidate, res;
        firstOpen = str.indexOf('[', firstOpen + 1);
        do {
            firstClose = str.lastIndexOf(']');
            if (firstClose <= firstOpen) {
                return null;
            }
            do {
                candidate = str.substring(firstOpen, firstClose + 1);
                try {
                    res = JSON.parse(candidate);
                    return res;
                }
                catch (e) {
                }
                firstClose = str.substr(0, firstClose).lastIndexOf(']');
            } while (firstClose > firstOpen);
            firstOpen = str.indexOf(']', firstOpen + 1);
        } while (firstOpen !== -1);
    },
    getAddressByPoints: function (data) {

        if (!data.latitude || !data.longitude) {
            throw "Coordinates weren't set, please set their.";
        }

        return axios({
            url: "https://maps.googleapis.com/maps/api/geocode/json?key=" + process.env.GOOGLE_KEY + "&latlng=" + [data.latitude, data.longitude].join(','),
            method: "get",
            responseType: 'json',
        }).then(response => {

            let address;
            address = response.data.results.filter(function (item) {
                return item.types.indexOf('street_address') > -1;
            });

            return address[0] || null;
        })
    },
    arrayUnique: function (array) {
        let a = array.concat();
        for (let i = 0; i < a.length; ++i) {
            for (let j = i + 1; j < a.length; ++j) {
                if (a[i] === a[j])
                    a.splice(j--, 1);
            }
        }

        return a;
    },
    excludeItemFromArray: function (index, value, array) {
        if (array && index && value) {
            return array.filter(function (item) {
                return item[index] !== value;
            })
        }
    }
};