'use strict';

const ConnectNetwork = require('../modules/connect-to-network');
const Card = require('composer-common/lib/idcard');
const AdminConnection = require('composer-admin').AdminConnection;
const rUtils = require("./rUtils.js");

class Participants {

    constructor(connect) {
        this.connect = connect;
    }


    search(resource, data = {}) {
        let networkDefinition,
            filter,
            query,
            serializer;
        return this.connect.then((networkConnection) => {
            networkDefinition = networkConnection;
            filter = ConnectNetwork.prepareQuery(resource.class, data, 'OR');
            query = networkConnection.buildQuery(filter.query);
            serializer = networkDefinition.businessNetwork.getSerializer();

            return networkConnection.query(query, filter.filterData);
        }).then((result) => {

            return networkDefinition.getAssetRegistry(resource.class).then(registry => {
                return Promise.all(result.map(function (asset) {
                    return registry.resolve(asset.getIdentifier());
                }));
            });
        }).then((assets) => {
            assets.sort(function (a, b) {
                if (a.hasOwnProperty('dateCreate') && b.hasOwnProperty('dateCreate')) {
                    return new Date(b.dateCreate) - new Date(a.dateCreate);
                }
            });

            return assets;
        })
    };

    getAllParticipantByResourceName(name, id = null) {
        return this.connect.then((networkConnection) => {
            return networkConnection.getParticipantRegistry(name).then((r) => {
                return (id) ? r.get(id) : r.resolveAll();
            }).then((result) => {
                return result;
            })
        })
    };

    //Create participant (transaction send)
    create(resource, data) {
        let networkDefinition;
        return this.connect.then((networkConnection) => {
            networkDefinition = networkConnection.businessNetwork;
            let serializer = networkDefinition.getSerializer();
            return networkConnection.getParticipantRegistry(resource.class).then(() => {
                let factory = networkDefinition.getFactory();

                return networkConnection.submitTransaction(Object.assign(factory.newTransaction(resource.transaction.namespace, resource.transaction.name), serializer.fromJSON(data)));
            }).then(() => {
                return {success: true, data: serializer.fromJSON(data).data}
            })
        })
    }

    //Update participant (transaction send)
    update(resource, data) {
        let networkDefinition;
        return this.connect.then((networkConnection) => {
            networkDefinition = networkConnection.businessNetwork;
            return networkConnection.getParticipantRegistry(resource.class).then(() => {
                let factory = networkDefinition.getFactory();
                let serializer = networkDefinition.getSerializer();

                return networkConnection.submitTransaction(Object.assign(factory.newTransaction(resource.transaction.namespace, resource.transaction.name), serializer.fromJSON(data)));
            }).then(() => {
                return {success: true}
            });
        });
    }

    //Identity participant
    identity(resource, data) {
        let networkDefinition;
        let adminConnection;
        let cardName;

        return this.connect.then((networkConnection) => {
            networkDefinition = networkConnection.businessNetwork;
            adminConnection = new AdminConnection({cardStore: networkConnection.cardStore});

            return networkConnection.issueIdentity(resource.class + '#' + data.id, data.login)
                .then((result) => {
                    cardName = result.userID + '@' + networkConnection.getCard().getBusinessNetworkName();
                    return {success: false, userLogin: result.userID, userSecret: result.userSecret};
                }).then((result) => {
                    //Init new card
                    let card = new Card({
                        "version": 1,
                        "userName": result.userLogin,
                        "businessNetwork": networkConnection.getCard().getBusinessNetworkName(),
                        "enrollmentSecret": result.userSecret,
                        "roles": []
                    }, networkConnection.getCard().connectionProfile);
                    //Import card (as ADMIN)
                    return adminConnection.importCard(cardName, card)
                        .then(() => {
                            //Active identity
                            return ConnectNetwork.activeIdentityByCard(cardName)
                                .then(() => {
                                    return Object.assign(result, {
                                        success: true,
                                        cardName: cardName
                                    });
                                })
                        })
                })
        });
    }
}


module.exports = Participants;