'use strict';
const config = require('config').get('chain-pad');
const Participants = require('../Participants');
const SHA256 = require("crypto-js/sha256");
const mongoose = require('mongoose');
const crypto = require('crypto');
const db = mongoose.connect(process.env.MONGO_HOST, {
    useCreateIndex: true,
    useNewUrlParser: true
});
db.Promise = require('bluebird');
const UserMongo = require('../models/userModel');
const log = require('../CPLogger');
const CPUtils = require('../CPUtils');

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
                users[key] = Object.assign(user.toJSON(), {userId: user.networkCard.split('@')[0]});

            });
            return users;
        });
    }

    static getUserMongo(userData, byField = 'email') {
        let field;
        switch (byField) {
            case 'id':
                field = {userId: userData.userId};
                break;
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

    static checkUserMongo(userData, byField = 'phone') {
        let field;
        switch (byField) {
            case 'id':
                field = {userId: userData.userId};
                break;
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
                if (user) {
                    if (userData.fcmId) {
                        return this.setDevice(user, userData.fcmId).then(user => {
                            return Promise.resolve(Object.assign({user: user}));
                        })
                    }
                    return Promise.resolve(Object.assign({user: user}));
                } else {
                    return Promise.resolve({user: null});
                }
            });
    }

    static setDevice(user, device) {
        user.set({device: CPUtils.arrayUnique(user.device.concat([device]))});
        return user.save();
    }

    static createUserMongo(userData) {
        let user = {
            phone: userData.phone,
            networkCard: userData.networkCard,
            userId: userData.networkCard.split('@')[0]
        };

        if (userData.name) {
            user.name = userData.name;
        }

        if (userData.lastName) {
            user.lastName = userData.lastName;
        }

        if (userData.name) {
            user.email = userData.email;
        }


        if (userData.role) {
            user.role = userData.role;
        }

        if (userData.fcmId) {
            user.device = userData.fcmId;
        }

        if (userData.locale) {
            user.locale = userData.locale;
        }

        return new UserMongo(user).save();
    }

    static updateUserMongo(id, userData) {
        return UserMongo.findOne({networkCard: id}).then(user => {

            if (userData.name) {
                user.name = userData.name;
            }

            if (userData.lastName) {
                user.lastName = userData.lastName;
            }

            if (userData.name) {
                user.email = userData.email;
            }


            if (userData.role) {
                user.role = userData.role;
            }

            if (userData.fcmId) {
                user.set({device: CPUtils.arrayUnique(user.device.concat([userData.fcmId]))});
            }

            if (userData.locale) {
                user.locale = userData.locale;
            }

            return user.save();
        });


    }

    createUser(arData) {
        //const id = arData.phone;
        let date, id;
        date = new Date();
        id = SHA256(JSON.stringify(arData) + date.toJSON()).toString();

        return UserMongo.findOne({phone: arData.phone})
            .then(userMongo => {

                if (userMongo) {
                    throw {error: "This user already exists!"};
                }

                return this.action({
                    class: this.participant['fullNamespace'],
                    transaction: this.participant['transactions']['createUser']
                }, {
                    "$class": this.participant['transactions']['createUser']['fullNamespace'],
                    data: {
                        "$class": this.participant['fullNamespace'],
                        "userId": id,
                        "phone": arData.phone,
                    },
                }).then(result => {
                    if (result.success) {
                        return this.identity({
                            class: this.participant['fullNamespace']
                        }, {
                            id: result.data.userId,
                            login: id,
                        }).then(participant => {
                            if (result.success) {

                                if (!arData.networkCard) {
                                    arData.networkCard = participant.cardName;
                                }

                                return User.createUserMongo(arData).then(user => Object.assign({}, {
                                    success: true,
                                    user: user
                                }));

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
        }).then(user => {
            return User.updateUserMongo(user.data.userId + '@' + config['network-name'], user.data).then(user => Object.assign({}, {
                success: true,
                user: user
            }));
        });
    }
}

function hash(text) {
    return crypto.createHash('sha1').update(text).digest('base64');
}

module.exports = User;
