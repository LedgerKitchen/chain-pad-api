'use strict';

const User = require("./repo/userRepository");
const Pad = require("./repo/padRepository");
const History = require("./History");
const HLF = require("./HLFConnector");
const log = require("./CPLogger");
const EventEmitter = require('events');

class CPLedger extends EventEmitter {
    constructor() {
        super();

        this.on('actionPadEvent', (connect, event, participant) => {
            log.info('Caught event action from CPLedger --> actionPadEvent');
            return Pad.event(connect, event, participant);
        });
    }

    init(card) {
        let self = this;
        return HLF.network(card)
            .then((connect) => {
                this.hlf = connect;

                connect.once('event', (event) => {
                    try {
                        log.info('Caught event from HLF.');
                        let currentParticipant;
                        return connect.then(async (networkConnection) => {
                            let networkDefinition = networkConnection.businessNetwork,
                                serializer = networkDefinition.getSerializer();
                            currentParticipant = networkConnection.getCard().getUserName();
                            return serializer.toJSON(event);
                        }).then(function (arEvent) {
                            if (arEvent.action && typeof arEvent['$class'] !== 'undefined') {
                                let actType = arEvent['$class'].split('.');
                                actType = actType[actType.length - 1];

                                log.info('Caught event action --> ' + arEvent.action + ' & Action Type -->' + actType);

                                if (actType) self.emit(actType, new Promise((resolve) => {
                                    resolve(connect);
                                }), arEvent, currentParticipant);
                            }

                        });
                    } catch (e) {
                        log.error(e);
                    }
                });

                this.on('hlf-connection-close', async (connect) => {
                    await HLF.closeNetwork(connect);
                });

                this.on('testEvent', (r) => {
                    console.log('work');
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