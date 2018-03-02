'use strict';
const fs = require('fs');
const path = require('path');

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
                } else if (error.indexOf('[AccessException:') - 1) {
                    arString = error.split('[AccessException:');
                }

                //let stringError = '';
                if (arString[1]) {
                    let arString2 = arString[1].split(']');
                    // if (arString2.length) {
                    //     stringError = arString2[1]
                    // } else {
                    //     stringError = arString[1];
                    // }
                    // stringError = stringError.replace(/(^\s*)|(\s*)$/g, '');
                    //
                    // if (stringError.slice(-1) === ']') {
                    //     stringError = stringError.slice(0, -1);
                    // }
                    //
                    // return stringError.replace(/(^\s*)|(\s*)$/g, '');
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
    }
};