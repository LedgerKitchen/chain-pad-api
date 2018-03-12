'use strict';
const config = require('config').get('chain-pad');
const Participants = require('../participants');
const SHA256 = require("crypto-js/sha256");
const mongoose = require('mongoose');
const crypto = require('crypto');
const db = mongoose.connect(process.env.MONGO_HOST, {});
db.Promise = require('bluebird');
const UserMongo = require('./userMongo');
const log = require('../logger');

class User extends Participants {
    constructor(connect) {
        super(connect);
        this.participant = require('config').get('chain-pad.architecture.participants.user');
    }

    getAllUsers(id = null) {
        return this.getAllParticipantByResourceName(this.participant['fullNamespace'], id);
    }

    search(arFilter = {}) {
        return super.search({
            class: this.participant['fullNamespace']
        }, arFilter);
    }

    searchInMongo(arFilter = {}) {
        return UserMongo.find(arFilter).select('-password').then((users) => {
            users.forEach((user, key) => {
                users[key] = Object.assign(user.toJSON(), {participantId: user.networkCard.split('@')[0]});

            });
            return users;
        });
    }

    static getUserMongo(userData, byField = 'email') {
        let field;
        switch (byField) {
            case 'email':
                field = {email: userData.email};
                break;
            case 'phone':
                field = {phone: userData.phone};
                break;
            case 'email+phone':
                field = {email: userData.email, phone: userData.phone};
                break;
        }
        return UserMongo.findOne(field);
    }

    static checkUserMongo(userData, byField = 'email') {
        let field;
        switch (byField) {
            case 'email':
                field = {email: userData.email};
                break;
            case 'phone':
                field = {phone: userData.phone};
                break;
            case 'email+phone':
                field = {email: userData.email, phone: userData.phone};
                break;
        }

        return UserMongo.findOne(field)
            .then(user => {
                if (user && user.password === hash(userData.password)) {
                    return Promise.resolve(user);
                } else {
                    return Promise.reject("Incorrect Email or Password");
                }
            });
    }

    static createUserMongo(userData) {
        let user = {
            name: userData.name,
            lastName: userData.lastName,
            email: userData.email,
            phone: userData.phone,
            password: hash(userData.password),
            networkCard: userData.networkCard
        };

        if (userData.role) {
            user.role = userData.role;
        }

        return new UserMongo(user).save();
    }

    createUser(arData) {
        const id = SHA256(arData.email + arData.phone).toString();
        return UserMongo.find()
            .or([{email: arData.email}, {phone: arData.phone}])
            .then(userMongo => {

                if (typeof userMongo !== 'undefined' && userMongo.length > 0) {
                    throw {error: "This user already exists!"};
                }

                return this.action({
                    class: this.participant['fullNamespace'],
                    transaction: this.participant['transactions']['createUser']
                }, {
                    "$class": this.participant['transactions']['createUser']['fullNamespace'],
                    data: Object.assign({
                        "$class": this.participant['fullNamespace'],
                        "userId": id,
                    }, arData)
                }).then(result => {
                    if (result.success) {
                        return this.identity({
                            class: this.participant['fullNamespace']
                        }, {
                            id: result.data.userId,
                            login: id,
                        }).then(participant => {
                            if (result.success) {
                                if (!arData.password) {
                                    arData.password = participant.userSecret;
                                }

                                if (!arData.networkCard) {
                                    arData.networkCard = participant.cardName;
                                }

                                return User.createUserMongo(arData).then((user) => {
                                    return {success: true, User: user};
                                })
                            }
                        });
                    }

                    return result;
                })
            })

    }

    updateUser(arData) {
        return this.action({
            class: this.participant['fullNamespace'],
            transaction: this.participant['transactions']['updateUser']
        }, {
            "$class": this.participant['transactions']['updateUser']['fullNamespace'],
            data: Object.assign({
                "$class": this.participant['fullNamespace'],
            }, arData)
        });
    }
}

function hash(text) {
    return crypto.createHash('sha1').update(text).digest('base64');
}

module.exports = User;
