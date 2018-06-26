let express = require("express");
let router = express.Router();
let CPUtils = require("../modules/CPUtils");
const User = require("../modules/repo/userRepository");
let middlewares = require('../modules/CPMiddlewares');
let QRCode = require('qrcode');
const config = require('config').get('chain-pad');

/******************* ALL PARTICIPANTS ROUTES *******************/
router.post("/", [middlewares.onlyAdminAccess], function (req, res, next) {

    return req.CPLedger.init(req.user.networkCard)
        .then((Ledger) => {
            return Ledger.User.getAllUsers().then(users => {
                return res.json({success: true, items: users, user: req.user});
            })
        }).catch((result) => {
            let error = result.error || result.message;

            return res.send({success: false, message: CPUtils.parseErrorHLF(error)});
        });
});
router.post("/me", function (req, res, next) {
    let data = req.body;
    return req.CPLedger.init(req.user.networkCard)
        .then((Ledger) => {
            return Ledger.User.getAllUsers(req.user.userId).then(user => {
                QRCode.toDataURL(req.user.userId).then(qrCode => {
                    return {success: true, item: user, user: req.user, qrCode: qrCode};
                }).then(result => {
                    return User.checkUserMongo(data).then(() => res.json(result))
                });
            })
        }).catch((result) => {
            let error = result.error || result.message;

            return res.send({success: false, message: CPUtils.parseErrorHLF(error)});
        });
});
router.post("/me/check", function (req, res, next) {
    let data = req.body;
    return req.CPLedger.init(req.user.networkCard)
        .then(() => {
            return User.checkUserMongo(Object.assign(data, {phone: req.user.phone})).then(() => res.json({success: true}))
        }).catch((result) => {
            let error = result.error || result.message;

            return res.send({success: false, message: CPUtils.parseErrorHLF(error)});
        });
});
router.post("/new", [middlewares.onlyAdminAccess], function (req, res, next) {

    return req.CPLedger.init(req.user.networkCard)
        .then((Ledger) => {
            let data = req.body;
            data.phone = data.phone.replace(/[^0-9]/gim, '');
            if (data.token) {
                delete data.token
            }
            if (data.fcmId) {
                delete data.fcmId;
            }
            if (data.locale) {
                delete data.locale;
            }
            return Ledger.User.createUser(data)
                .then((result) => {
                    return res.json(result);
                })
        }).catch((result) => {
            let error = result.error || result.message;

            return res.send({success: false, message: CPUtils.parseErrorHLF(error)});
        });
});

router.post("/edit", function (req, res, next) {

    return req.CPLedger.init(req.user.networkCard)
        .then((Ledger) => {
            let data = req.body;

            data.phone = req.user.phone.replace(/[^0-9]/gim, '');

            if (data.token) {
                delete data.token
            }
            if (data.fcmId) {
                delete data.fcmId;
            }
            if (data.locale) {
                delete data.locale;
            }
            return Ledger.User.updateUser(data)
                .then((result) => {
                    return res.json(result);
                });
        }).catch((result) => {
            let error = result.error || result.message;

            return res.send({success: false, message: CPUtils.parseErrorHLF(error)});
        });
});

router.post("/search", function (req, res, next) {
    return req.CPLedger.init(req.user.networkCard)
        .then((Ledger) => {
            let query = req.body.query || '', searchObject = {};

            switch (req.body.field || 'phone') {
                case 'id':
                    searchObject = {networkCard: {$eq: query + '@' + config['network-name']}};
                    break;
                default:
                case 'phone':
                    searchObject = {phone: new RegExp('.*' + query.replace(/[^0-9]/gim, '') + '.*', "i")};
                    break
            }

            return Ledger.User.searchInMongo({
                $and: [Object.assign({
                    role: {$eq: 'PARTICIPANT'}
                }, searchObject)]
            }).then((result) => {
                if (result.length) {
                    delete result[0]['_id'];
                    delete result[0]['__v'];
                    return res.json({success: true, user: result[0]});
                }

                return res.json({success: false, message: 'User not found'});
            });
        }).catch((result) => {
            let error = result.error || result.message;

            return res.send({success: false, message: CPUtils.parseErrorHLF(error)});
        });
});

router.post("/checkExistsByPhone", function (req, res, next) {
    return req.CPLedger.init(req.user.networkCard)
        .then((Ledger) => {

            let phones = req.body.phone || [''];

            return Ledger.User.searchInMongo({
                $or: [
                    {
                        phone: {
                            $in: phones.map(function (item) {
                                return item.replace(/[^0-9]/gim, '');
                            })
                        }
                    },
                ],
                $and: [{
                    role: {$eq: 'PARTICIPANT'}
                }]
            }).then((result) => {
                return res.json({
                    success: true, users: result.map(item => {
                        delete item['_id'];
                        delete item['__v'];

                        return item;
                    })
                });
            });
        }).catch((result) => {
            let error = result.error || result.message;

            return res.send({success: false, message: CPUtils.parseErrorHLF(error)});
        });
});
/******************* END ALL PARTICIPANTS ROUTES *******************/

module.exports = router;