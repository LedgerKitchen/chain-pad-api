'use strict';

const ConnectNetwork = require('../modules/connect-to-network');

class Assets {

    constructor(connect) {
        this.connect = connect;
    }

    getAllAssetsByResourceName(name, id = null) {
        return this.connect.then((networkConnection) => {
            return networkConnection.getAssetRegistry(name)
                .then((r) => {
                    return (id) ? r.resolve(id) : r.resolveAll();
                }).then((result) => {
                    return result;
                })
        }).catch((error) => {
            throw error;
        });
    }

    getAssetById(resource, id) {
        return this.connect.then((networkConnection) => {
            return networkConnection.getAssetRegistry(resource.class)
                .then((items) => {
                    return items.resolve(id);
                })
        })
    }

    search(resource, data = {}) {
        let networkDefinition,
            filter,
            query,
            serializer;
        return this.connect.then((networkConnection) => {
            networkDefinition = networkConnection;
            filter = ConnectNetwork.prepareQuery(resource.class, data);
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

    //Create assets (transaction send)
    create(resource, data) {
        return this.connect.then((networkConnection) => {
            let networkDefinition = networkConnection.businessNetwork,
                factory = networkDefinition.getFactory(),
                serializer = networkDefinition.getSerializer();
            return networkConnection.getAssetRegistry(resource.class).then(() => {
                return networkConnection.submitTransaction(Object.assign(factory.newTransaction(resource.transaction.namespace, resource.transaction.name), serializer.fromJSON(data)));
            }).then(() => {
                return {success: true}
            });
        })
    }

    update(resource, data) {

        return this.connect.then((networkConnection) => {
            let networkDefinition = networkConnection.businessNetwork,
                factory = networkDefinition.getFactory(),
                serializer = networkDefinition.getSerializer();
            return networkConnection.getAssetRegistry(resource.class).then(() => {
                return networkConnection.submitTransaction(Object.assign(factory.newTransaction(resource.transaction.namespace, resource.transaction.name), serializer.fromJSON(data)));
            }).then(() => {
                return {success: true}
            });
        });
    }


}


module.exports = Assets;