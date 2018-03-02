'use strict';

const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const Util = require('composer-common').Util;
const TransactionDeclaration = require('composer-common').TransactionDeclaration;


class BCN extends BusinessNetworkConnection {
    constructor(options) {
        super(options);
        this.setMaxListeners(0);
        this.rUtils = require("./rUtils");
    }

    addHistory(eventData, historyRecordId) {
        let history = {
                "$class": "org.roochey.admin.TransactionHistoryAdd",
                historyData: {
                    "$class": "org.roochey.admin.TransactionHistory",
                    "transactionId": "",
                    "historyRecordId": "",
                    "resourceId": "",
                    "resourceNamespace": "",
                    "fields": "",
                }
            },
            send = false;
        if (eventData.$class) {
            switch (eventData.$class) {
                case 'org.roochey.admin.CreateManufacturer':
                case 'org.roochey.admin.UpdateManufacturer':
                case 'org.roochey.admin.CreateSto':
                case 'org.roochey.admin.UpdateSto':
                case 'org.roochey.admin.CreateOwner':
                case 'org.roochey.admin.UpdateOwner':
                case 'org.roochey.admin.CreateCheckpoint':
                case 'org.roochey.admin.UpdateCheckpoint':
                case 'org.roochey.admin.CreateBank':
                case 'org.roochey.admin.UpdateBank':
                    history.historyData.resourceId = eventData.companyData.companyId;
                    history.historyData.resourceNamespace = eventData.companyData.$class;
                    history.historyData.fields = eventData.companyData;
                    let action = eventData.$class.split('.');
                    history.historyData.transactionType = this.rUtils.cmcToString(action[action.length -1]);
                    send = true;
                    break;
                case 'org.roochey.manufacturer.MakeCar':
                    history.historyData.resourceId = eventData.carData.itemId;
                    history.historyData.resourceNamespace = eventData.carData.$class;
                    history.historyData.fields = eventData.carData;
                    history.historyData.transactionType = 'create car';
                    send = true;
                    break;
                case 'org.roochey.manufacturer.UpdateCar':
                    history.historyData.resourceId = eventData.carData.itemId;
                    history.historyData.resourceNamespace = eventData.carData.$class;
                    history.historyData.fields = eventData.carData;
                    history.historyData.transactionType = 'update car';
                    send = true;
                    break;
                case 'org.roochey.manufacturer.UpdateCarStates':
                    history.historyData.resourceId = eventData.itemId;
                    history.historyData.resourceNamespace = eventData.$class;
                    history.historyData.fields = eventData;
                    delete eventData.states['$class'];
                    history.historyData.transactionType = 'change car state (' + Object.keys(eventData.states).toString() + ')';
                    send = true;
                    break;
                case 'org.roochey.manufacturer.ReleaseCarOnLine':
                    history.historyData.resourceId = eventData.itemId;
                    history.historyData.resourceNamespace = eventData.$class;
                    history.historyData.fields = eventData;
                    history.historyData.transactionType = 'car on line';
                    send = true;
                    break;
                case 'org.roochey.manufacturer.MakePart':
                    history.historyData.resourceId = eventData.partData.itemId;
                    history.historyData.resourceNamespace = eventData.partData.$class;
                    history.historyData.fields = eventData.partData;
                    history.historyData.transactionType = 'create part';
                    send = true;
                    break;
                case 'org.roochey.manufacturer.UpdatePart':
                    history.historyData.resourceId = eventData.partData.itemId;
                    history.historyData.resourceNamespace = eventData.partData.$class;
                    history.historyData.fields = eventData.partData;
                    history.historyData.transactionType = 'update part';
                    send = true;
                    break;
                case 'org.roochey.bank.MakeWallet':
                    history.historyData.resourceId = eventData.walletData.itemId;
                    history.historyData.resourceNamespace = eventData.walletData.$class;
                    history.historyData.fields = eventData.walletData;
                    history.historyData.transactionType = 'create wallet';
                    send = true;
                    break;
                case 'org.roochey.bank.UpdateWallet':
                    history.historyData.resourceId = eventData.walletData.itemId;
                    history.historyData.resourceNamespace = eventData.walletData.$class;
                    history.historyData.fields = eventData.walletData;
                    history.historyData.transactionType = 'update wallet';
                    send = true;
                    break;
                case 'org.roochey.bank.RefillWallet':
                    history.historyData.resourceId = eventData.receiver;
                    history.historyData.resourceNamespace = eventData.$class;
                    history.historyData.fields = eventData;
                    history.historyData.transactionType = 'refill wallet';
                    send = true;
                    break;
                case 'org.roochey.bank.Wallet2Wallet':
                    history.historyData.resourceId = eventData.sender;
                    history.historyData.resourceId2 = eventData.receiver;
                    history.historyData.resourceNamespace = eventData.$class;
                    history.historyData.fields = eventData;
                    history.historyData.transactionType = 'wallet to wallet';
                    send = true;
                    break;
            }

            if (send) {
                return Util.createTransactionId(this.securityContext)
                    .then((id) => {
                        let factory = this.getBusinessNetwork().getFactory(),
                            serializer = this.getBusinessNetwork().getSerializer();

                        let transaction = Object.assign(factory.newTransaction('org.roochey.admin', 'TransactionHistoryAdd'), serializer.fromJSON({
                            "$class": "org.roochey.admin.TransactionHistoryAdd",
                            "historyData": {
                                "$class": "org.roochey.admin.TransactionHistory",
                                "transactionId": id.idStr,
                                "historyRecordId": historyRecordId,
                                "resourceId": history.historyData.resourceId,
                                "resourceId2": history.historyData.resourceId2,
                                "resourceNamespace": history.historyData.resourceNamespace,
                                "transactionType": history.historyData.transactionType,
                                "fields": JSON.stringify(history.historyData.fields),
                                "date": eventData.timestamp
                            }
                        }));

                        return this.submitTransaction(transaction).then(() => {
                            return historyRecordId;
                        });
                    });
            } else if (historyRecordId) {
                return historyRecordId;
            }
        }

    }

    submitTransaction(transaction) {
        Util.securityCheck(this.securityContext);
        if (!transaction) {
            throw new Error('transaction not specified');
        }
        let classDeclaration = transaction.getClassDeclaration();
        if (!(classDeclaration instanceof TransactionDeclaration)) {
            throw new Error(classDeclaration.getFullyQualifiedName() + ' is not a transaction');
        }

        return Util.createTransactionId(this.securityContext)
            .then((id) => {
                transaction.setIdentifier(id.idStr);
                transaction.timestamp = new Date();

                let data = this.getBusinessNetwork().getSerializer().toJSON(transaction);
                return Util.invokeChainCode(this.securityContext, 'submitTransaction', [JSON.stringify(data)], {transactionId: id.id}).then(() => {
                    return this.addHistory(data, id.idStr);
                });
            });

    }
}

module.exports = BCN;