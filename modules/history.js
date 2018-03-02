'use strict';

class History {

    constructor(connect) {
        this.connect = connect;
    }

    //org.hyperledger.composer.system.HistorianRecord
    getAllHistory() {
        return this.connect.then((networkConnection) => {
            return networkConnection.getHistorian().then((r) => {
                return r.resolveAll();
            }).then((result) => {
                result.sort(function (a, b) {
                    return new Date(b.transactionTimestamp) - new Date(a.transactionTimestamp);
                });
                return result;
            })
        })
    };

    searchInHistory(identifier) {
        let networkDefinition,
            el = [],
            ar = [];

        return this.connect.then((networkConnection) => {
            networkDefinition = networkConnection.businessNetwork;
            let query = networkConnection.buildQuery('SELECT org.roochey.admin.TransactionHistory WHERE (resourceId == _$inputValue OR resourceId2 == _$inputValue)');
            return networkConnection.query(query, {inputValue: identifier});
        }).then((result) => {
            let serializer = networkDefinition.getSerializer();

            result.forEach(function (asset) {
                ar = serializer.toJSON(asset);
                ar.fields = JSON.parse(ar.fields);
                el.push(ar);
            });

            el.sort(function (a, b) {
                return new Date(b.date) - new Date(a.date);
            });

            return el;
        })
    };

}

module.exports = History;