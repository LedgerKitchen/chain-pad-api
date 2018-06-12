'use strict';

const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const config = require('config').get('chain-pad');
const log = require('./CPLogger.js');

class ConnectNetwork {
    constructor() {
        this.networkConnection = new BusinessNetworkConnection();
        this.networkDefinition = null;
        this.config = config;


    }

    /* If need create new network instance */
    initNetwork() {
        log.info('HLF connector has been started...');
        return this.networkConnection.connect(process.env.CARD)
            .then((result) => {
                this.networkDefinition = result;
                log.info('HLF connection to ' + result.getIdentifier() + ' successfully installed...');
                return true;
            })
    }

    static activeIdentityByCard(card) {
        let nc = new BusinessNetworkConnection();
        return nc.connect(card).then(_ => {
            log.info('Card identity ' + card + ' successfully activated...');
            return nc.disconnect();
        })
    }

    /* Create one network instance */
    static network(cardName) {
        this.card = cardName ? cardName : process.env.CARD;
        log.info('HLF network card ->' + this.card);
        this.networkConnection = new BusinessNetworkConnection();
        log.info('HLF connector has been initializing...');

        return this.networkConnection.connect(this.card)
            .then((result) => {
                log.info('HLF connection to -> ' + result.getIdentifier() + ' successfully started with a card -> ' + this.card);
                return this.networkConnection;
            })
    }

    static closeNetwork(connect) {
        log.info('HLF connection to -> chainpad-network@0.0.1 was disconnected');
        return connect.disconnect();
    }

    /* Prepare query to search */
    static prepareQuery(resource, data, logic = 'AND') {
        let filter = {},
            query = 'SELECT ' + resource,
            filterAr = [];

        for (let key in data) {
            if (data[key]) {
                if (typeof data[key] === 'object') {
                    for (let kk in data[key]) {
                        if (data[key][kk]) {
                            filterAr.push(key + '.' + kk + ' == _$' + key + '_' + kk);
                            Object.assign(filter, {[key + '_' + kk]: data[key][kk]});
                        }
                    }
                } else {
                    Object.assign(filter, {[key]: data[key]});
                    filterAr.push(key + ' == _$' + key);
                }
            }
        }

        return {
            query: (filterAr.length) ? query + ' WHERE (' + filterAr.join(' ' + logic + ' ') + ')' : query,
            filterData: filter
        };
    }
}

module.exports = ConnectNetwork;