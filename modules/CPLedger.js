'use strict';

const User = require("./repo/userRepository");
const Pad = require("./repo/padRepository");
const History = require("./History");
const EventEmitter = require('events');
const HLF = require("./HLFConnector");
const log = require("./CPLogger");

//let emitter = new EventEmitter();


class CPLedger extends EventEmitter {
    constructor() {
        super();
    }

    init(card) {
        return HLF.network(card)
            .then((connect) => {
                this.hlf = connect;

                connect.once('event', (event) => {
                    try {
                        log.info('caught event from HLF.');
                        let arEvent;
                        return connect.then(async (networkConnection) => {
                            let networkDefinition = networkConnection.businessNetwork,
                                serializer = networkDefinition.getSerializer();
                            //console.log(arEvent);

                            return serializer.toJSON(event);
                        }).then(function (arEvent) {

                            if (arEvent.action) {
                                log.info('caught event action --> ' + arEvent.action);
                                switch (arEvent.action) {
                                    case 'create':
                                        break;
                                    case 'update':
                                        break;
                                    case 'addFiles':
                                        break;
                                    case 'accept':
                                    case 'decline':
                                    case 'publish':
                                    case 'delete':
                                        break;
                                }
                            }

                        });
                    } catch (e) {
                        log.error(e);
                    }
                });

                this.on('hlf-connection-close', async (connect) => {
                    await HLF.closeNetwork(connect);
                });


                connect = new Promise((resolve) => {
                    resolve(connect);
                });

                return {
                    User: new User(connect),
                    Pad: new Pad(connect),
                    History: new History(connect)
                }
            })
    }

    close() {
        this.emit('hlf-connection-close', this.hlf);
    }
}

module.exports = CPLedger;