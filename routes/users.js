let express = require("express");
let router = express.Router();
let rUtils = require("../modules/rUtils");
let middlewares = require('../modules/middlewares');

/******************* ALL PARTICIPANTS ROUTES *******************/
router.post("/", [middlewares.onlyAdminAccess], function (req, res, next) {

    return req.LedgerConnector.init(req.user.networkCard)
        .then((Ledger) => {
            return Ledger.User.getAllUsers().then(users => {
                return res.json({success: true, items: users, user: req.user});
            })
        }).catch((result) => {
            let error = result.error || result.message;

            return res.send({success: false, message: rUtils.parseErrorHLF(error)});
        });
});
router.post("/me", function (req, res, next) {
    return req.LedgerConnector.init(req.user.networkCard)
        .then((Ledger) => {
            return Ledger.User.getAllUsers(req.user.participantId).then(user => {
                return res.json({success: true, item: user, user: req.user});
            })
        }).catch((result) => {
            let error = result.error || result.message;

            return res.send({success: false, message: rUtils.parseErrorHLF(error)});
        });
});
router.post("/new", [middlewares.onlyAdminAccess], function (req, res, next) {

    return req.LedgerConnector.init(req.user.networkCard)
        .then((Ledger) => {
            let data = req.body;
            data.phone = data.phone.replace(/[^0-9]/gim, '');
            return Ledger.User.createUser(data)
                .then((result) => {
                    return res.json(result);
                })
        }).catch((result) => {
            let error = result.error || result.message;

            return res.send({success: false, message: rUtils.parseErrorHLF(error)});
        });
});

router.post("/edit", function (req, res, next) {

    return req.LedgerConnector.init(req.user.networkCard)
        .then((Ledger) => {
            let data = req.body;
            if(data.phone) {
                data.phone = data.phone.replace(/[^0-9]/gim, '');
            }else{
                data.phone = data.userId;
            }
            return Ledger.User.updateUser(data)
                .then((result) => {
                    return res.json(result);
                });
        }).catch((result) => {
            let error = result.error || result.message;

            return res.send({success: false, message: rUtils.parseErrorHLF(error)});
        });
});

router.post("/search", function (req, res, next) {
    return req.LedgerConnector.init(req.user.networkCard)
        .then((Ledger) => {
            req.body.query = req.body.query || '';
            return Ledger.User.searchInMongo({
                $or: [
                    //{name: new RegExp('.*' + req.body.query + '.*', "i")},
                    //{lastName: new RegExp('.*' + req.body.query + '.*', "i")},
                    {phone: new RegExp('.*' + req.body.query.replace(/[^0-9]/gim, '') + '.*', "i")},
                    //{email: new RegExp('.*' + req.body.query + '.*', "i")}
                ],
                $and: [{
                    role: {$eq: 'PARTICIPANT'},
                    networkCard: {$ne: req.user.networkCard}
                }]
            }).then((result) => {
                return res.json({success: true, items: result});
            });
        }).catch((result) => {
            let error = result.error || result.message;

            return res.send({success: false, message: rUtils.parseErrorHLF(error)});
        });
});
/******************* END ALL PARTICIPANTS ROUTES *******************/

module.exports = router;