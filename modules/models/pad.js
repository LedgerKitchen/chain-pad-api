'use strict';
'use strict';

const Assets = require('../assets');
const SHA256 = require("crypto-js/sha256");
const crypto = require('crypto');

class Pad extends Assets {

    constructor(connect) {
        super(connect);
        this.asset = require('config').get('chain-pad.architecture.assets.pad');
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
            }, arFilter.padId);
        }

        return this.search({
            class: this.asset['fullNamespace']
        }, arFilter);
    }

    createPad(arData) {
        let date = new Date(),
            id = SHA256(JSON.stringify(arData) + date.toJSON()).toString();

        if (typeof arData.participantsInvited === 'string') {
            arData.participantsInvited = [arData.participantsInvited];
        }

        return this.create({
            class: this.asset['fullNamespace'],
            transaction: this.asset['transactions']['createPad']
        }, {
            "$class": this.asset['transactions']['createPad']['fullNamespace'],
            data: Object.assign({
                "$class": this.asset['fullNamespace'],
                "padId": id
            }, arData)
        })

    }

    updatePad(arData) {
        if (typeof arData.participantsInvited === 'string') {
            arData.participantsInvited = [arData.participantsInvited];
        }
        return this.update({
            class: this.asset['fullNamespace'],
            transaction: this.asset['transactions']['updatePad']
        }, {
            "$class": this.asset['transactions']['updatePad']['fullNamespace'],
            data: Object.assign({
                "$class": this.asset['fullNamespace'],
            }, arData)
        });
    }
}

module.exports = Pad;