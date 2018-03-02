'use strict';

const User = require("../modules/models/user");
const Pad = require("../modules/models/pad");
const Participants = require("../modules/participants");
const History = require("../modules/history");


module.exports = {
    init: function (card) {

        return require("../modules/connect-to-network")
            .network(card)
            .then((connect) => {

                connect = new Promise((resolve) => {
                    resolve(connect);
                });

                return {
                    User: new User(connect),
                    Pad: new Pad(connect),
                    History: new History(connect),
                }
            })
    }
};