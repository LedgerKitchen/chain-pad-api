'use strict';

const fs = require('fs');
const path = require('path');
const axios = require('axios');

module.exports = {
    ucFirst: function (string) {
        return string.charAt(0).toUpperCase() + string.substr(1).toLowerCase();
    },
    cmcToString: function (string) {
        return string.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) {
            return str.toUpperCase();
        });
    },
    writeCardToFile: function (cardFileName, card) {
        let cardFilePath,
            dir = './exportsCards';
        cardFileName = './exportsCards/' + cardFileName + '.card';
        return card.toArchive({type: 'nodebuffer'})
            .then((cardBuffer) => {
                // got the id card to write to a buffer
                cardFilePath = path.resolve(cardFileName);
                try {
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir);
                    }
                    fs.writeFileSync(cardFilePath, cardBuffer);

                } catch (cause) {
                    const error = new Error(`Unable to write card file: ${cardFilePath}`);
                    error.cause = cause;
                    return Promise.reject(error);
                }
            });
    },
    getExportCardPath: './exportsCards/',
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
    }
};