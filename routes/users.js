let express = require("express");
let router = express.Router();
let Ledger = require("../modules/ledger");
let rUtils = require("../modules/rUtils");
let middlewares = require('../modules/middlewares');

/******************* ALL PARTICIPANTS ROUTES *******************/
router.get("/", middlewares.verifyToken, function (req, res, next) {

    return Ledger.init(req.user.networkCard)
        .then((Ledger) => {
            return Ledger.User.getAllUsers().then(users => {
                return res.json({items: users, user: req.user});
            })
        }).catch((result) => {
            let error = result.error || result.message;
            res.status(500);

            return res.send({success: false, message: rUtils.parseErrorHLF(error)});
        });
});
router.post("/new", middlewares.verifyToken, function (req, res, next) {

    return Ledger.init(req.user.networkCard)
        .then((Ledger) => {
            return Ledger.User.createUser(req.body)
                .then((result) => {
                    return res.json(result);
                })
        }).catch((result) => {
            let error = result.error || result.message;
            res.status(500);

            return res.send({success: false, message: rUtils.parseErrorHLF(error)});
        });
});

router.post("/edit", middlewares.verifyToken, function (req, res, next) {

    return Ledger.init(req.user.networkCard)
        .then((Ledger) => {
            return Ledger.User.updateUser(req.body)
                .then((result) => {
                    return res.json(result);
                });
        }).catch((result) => {
            let error = result.error || result.message;
            res.status(500);

            return res.send({success: false, message: rUtils.parseErrorHLF(error)});
        });
});

router.post("/search", middlewares.verifyToken, function (req, res, next) {
    return Ledger.init(req.user.networkCard)
        .then((Ledger) => {
            return Ledger.User.searchInMongo({
                $or: [
                    {name: new RegExp('.*' + req.body.query + '.*', "i")},
                    {lastName: new RegExp('.*' + req.body.query + '.*', "i")},
                    {phone: new RegExp('.*' + req.body.query + '.*', "i")},
                    {email: new RegExp('.*' + req.body.query + '.*', "i")}
                ],
                $and: [{
                    role: {$eq: 'PARTICIPANT'}
                }]
            }).then((result) => {
                return res.json(result);
            });
        }).catch((result) => {
            let error = result.error || result.message;
            res.status(500);

            return res.send({success: false, message: rUtils.parseErrorHLF(error)});
        });
});

// router.get("/:class/detail/:id", require('../userApi').checkAuth, function (req, res) {
//
//     if (!req.params.class || !req.params.id || accessParticipantName.indexOf(req.params.class) < 0) {
//         throw new Error('404', 404);
//     }
//
//     Ledger.init(req.user.networkCard).then((Ledger) => {
//         Ledger.Participants.getAllParticipantByResourceName('org.roochey.' + req.params.class.toLowerCase() + '.' + rUtils.ucFirst(req.params.class), req.params.id)
//             .then((participant) => {
//                 return Ledger.Assets.search('org.roochey.bank.Wallet', {"ownerId": req.params.id}).then((wallets) => {
//                     return Object.assign({}, {wallets: wallets});
//                 }).then((result) => {
//                     return Ledger.History.searchInHistory(req.params.id).then((r) => {
//                         return Object.assign(result, {histories: r});
//                     }).then((result) => {
//                         return res.render('participants/detail', Object.assign(result, {
//                             participant: participant,
//                             user: req.user,
//                             participantType: rUtils.ucFirst(req.params.class)
//                         }));
//                     });
//
//                 });
//             });
//     });
//
// });
// router.post("/:class/identity/add", require('../userApi').checkAuth, function (req, res, next) {
//
//     if (!req.params.class || accessParticipantName.indexOf(req.params.class) < 0) {
//         throw new Error('404', 404);
//     }
//
//     let participantData = req.body;
//     Ledger.init(req.user.networkCard).then((Ledger) => {
//         Ledger.Participants.identity(participantData)
//             .then((r) => {
//                 return res.json(r);
//             });
//     });
// });
// router.get("/card/download/:card", require('../userApi').checkAuth, function (req, res, next) {
//     if (!req.params.card) {
//         throw new Error('404', 404);
//     }
//
//     let card = req.params.card.indexOf('.card') > 0 ? req.params.card : req.params.card + '.card',
//         cardPath = rUtils.getExportCardPath + card;
//
//     fs.readFile(cardPath, function (err, content) {
//         if (err) {
//             res.writeHead(400, {'Content-type': 'text/html'})
//             res.end("No such file");
//         } else {
//             res.setHeader('Content-disposition', 'attachment; filename=' + card);
//             res.end(content);
//         }
//     });
// });
/******************* END ALL PARTICIPANTS ROUTES *******************/

module.exports = router;