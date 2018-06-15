'use strict';
'use strict';

const Assets = require('../Assets');
const SHA256 = require("crypto-js/sha256");
const crypto = require('crypto');
const ipfsAPI = require('ipfs-api');
let chainCrypto = require('../CPCrypto');
const CPUtils = require('../CPUtils');
const FCM = require('./lib/FCM');
const User = require("./userRepository");

class Pad extends Assets {

    constructor(connect) {
        super(connect);
        this.asset = require('config').get('chain-pad.architecture.assets.pad');
    }

    static event(connect, arEvent, currentParticipant) {
        let Pad = new this(connect),
            mAction,
            sendFCM = false;
        //console.log(arEvent, currentParticipant);

        switch (arEvent.action) {
            case 'createPad':
                mAction = 'create';
                break;
            case 'updatePad':
                mAction = 'update';
                break;
            case 'addFilesPad':
                break;
            case 'acceptPad':
                sendFCM = true;
                if (arEvent.pad.status === 'CLOSED') {
                    mAction = 'archive';
                } else {
                    mAction = 'accept';
                }
                break;
            case 'declinePad':
                sendFCM = true;
                mAction = 'decline';
                break;
            case 'publishPad':
                sendFCM = true;
                mAction = 'invite';
                break;
            /* case 'deletePad':
                 sendFCM = true;
                 mAction = 'accept';
                 break;*/
        }

        if (sendFCM && arEvent.pad.participantsInvited.length > 0) {
            Pad.getPads({}, {padId: arEvent.padId}).then(pad => {
                delete pad.history;
                let allParticipants = pad.participantsInvited.concat([pad.owner]);
                if (allParticipants.length > 0) {
                    return Promise.all(allParticipants.map(function (user) {
                        return User.getUserMongo({userId: user.userId}, 'id')
                    })).then(users => {
                        let fcmReceivers = [];

                        users.forEach(function (user) {
                            if (user.userId === currentParticipant) {
                                currentParticipant = user;
                            } else {
                                user.toObject().device.forEach((device) => {
                                    fcmReceivers.push(device);
                                });
                            }
                        });

                        fcmReceivers = CPUtils.arrayUnique(fcmReceivers);

                        FCM.sendMessage(fcmReceivers, {
                            data: {
                                "type": mAction,
                                "padId": pad.padId,
                                "pad": pad,

                                "initiator": currentParticipant.phone,
                                "padTitle": pad.name
                            }
                        });
                    });
                }
            });
        }
    }

    getPads(arParams = {}, arFilter = {}) {
        // if (arParams.hasOwnProperty('user')) {
        //     if (arParams.user.hasOwnProperty('isAdmin') && arParams.user.isAdmin === true) {
        //         Object.assign(arFilter, {'owner': arParams.user.id})
        //     }
        // }

        if (arFilter.hasOwnProperty('padId')) {
            return this.getAssetById({
                class: this.asset['fullNamespace']
            }, arFilter.padId).then(pad => {

                if (pad.cryptoAlgorithm) {
                    pad.text = chainCrypto.decryptText(pad.text);
                }

                return pad;
            });
        }

        return this.search({
            class: this.asset['fullNamespace']
        }, arFilter).then(pads => {
            return pads.map(pad => {
                if (pad.cryptoAlgorithm) {
                    pad.text = chainCrypto.decryptText(pad.text);
                }

                return pad;
            })
        });
    }

    async createPad(arData) {
        let date, id;
        date = new Date();
        id = SHA256(JSON.stringify(arData) + date.toJSON()).toString();

        if (typeof arData.participantsInvited === 'string') {
            arData.participantsInvited = [arData.participantsInvited];
        }

        if (arData.text) {
            arData.text = chainCrypto.encryptText(arData.text);
            arData.cryptoAlgorithm = process.env.CHAINPAD_CRYPTO_ALGHORITM;
            arData.crc = chainCrypto.crc(arData.text);
        }

        if (typeof arData.geo !== 'undefined' && typeof arData.geo.address === 'undefined') {
            await CPUtils.getAddressByPoints(arData.geo).then(addr => {
                arData.geo.address = addr.formatted_address;
            });
        }

        return this.action({
            class: this.asset['fullNamespace'],
            transaction: this.asset['transactions']['createPad']
        }, {
            "$class": this.asset['transactions']['createPad']['fullNamespace'],
            data: Object.assign({
                "$class": this.asset['fullNamespace'],
                "padId": id
            }, arData)
        }).then(result => {
            return Object.assign(result, {padId: id});
        })

    }

    async updatePad(arData) {
        if (typeof arData.participantsInvited === 'string') {
            arData.participantsInvited = [arData.participantsInvited];
        }

        if (arData.text) {
            arData.text = chainCrypto.encryptText(arData.text);
            arData.cryptoAlgorithm = process.env.CHAINPAD_CRYPTO_ALGHORITM;
            arData.crc = chainCrypto.crc(arData.text);
        }

        if (typeof arData.geo !== 'undefined' && typeof arData.geo.address === 'undefined') {
            await CPUtils.getAddressByPoints(arData.geo).then(addr => {
                arData.geo.address = addr.formatted_address;
            });
        }

        return this.action({
            class: this.asset['fullNamespace'],
            transaction: this.asset['transactions']['updatePad']
        }, {
            "$class": this.asset['transactions']['updatePad']['fullNamespace'],
            data: Object.assign({
                "$class": this.asset['fullNamespace'],
            }, arData)
        });
    }

    addFiles(arData) {
        return this.action({
            class: this.asset['fullNamespace'],
            transaction: this.asset['transactions']['addFiles']
        }, Object.assign({"$class": this.asset['transactions']['addFiles']['fullNamespace']}, arData));
    }

    deleteFile(arData) {
        return this.action({
            class: this.asset['fullNamespace'],
            transaction: this.asset['transactions']['deleteFile']
        }, Object.assign({"$class": this.asset['transactions']['deleteFile']['fullNamespace']}, arData));
    }

    acceptPad(arData) {
        return this.action({
            class: this.asset['fullNamespace'],
            transaction: this.asset['transactions']['acceptPad']
        }, Object.assign({"$class": this.asset['transactions']['acceptPad']['fullNamespace']}, arData));
    }

    declinePad(arData) {
        return this.action({
            class: this.asset['fullNamespace'],
            transaction: this.asset['transactions']['declinePad']
        }, Object.assign({"$class": this.asset['transactions']['declinePad']['fullNamespace']}, arData));
    }

    publishPad(arData) {
        return this.action({
            class: this.asset['fullNamespace'],
            transaction: this.asset['transactions']['publishPad']
        }, Object.assign({"$class": this.asset['transactions']['publishPad']['fullNamespace']}, arData));
    }

    deletePad(arData) {
        return this.action({
            class: this.asset['fullNamespace'],
            transaction: this.asset['transactions']['deletePad']
        }, Object.assign({"$class": this.asset['transactions']['deletePad']['fullNamespace']}, arData));
    }
}

module.exports = Pad;