let express = require("express");
let router = express.Router();
let Ledger = require("../modules/ledger");
let rUtils = require("../modules/rUtils");
let middlewares = require('../modules/middlewares');

/******************* PADS ROUTES *******************/
///assets/pads/new
router.get("/", middlewares.verifyToken, function (req, res, next) {

    return Ledger.init(req.user.networkCard)
        .then((Ledger) => {
            return Ledger.Pad.getPads({
                user: {
                    isAdmin: req.user === 'ADMIN',
                    id: req.user.participantId,
                    role: req.user.role,
                }
            }).then(pads => {
                return res.json({items: pads, user: req.user});
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
            return Ledger.Pad.createPad(Object.assign(req.body, {owner: req.user.participantId}))
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
            return Ledger.Pad.updatePad(req.body)
                .then((result) => {
                    return res.json(result);
                });
        }).catch((result) => {
            let error = result.error || result.message;
            res.status(500);

            return res.send({success: false, message: rUtils.parseErrorHLF(error)});
        });
});

router.post("/detail", middlewares.verifyToken, function (req, res, next) {
    return Ledger.init(req.user.networkCard)
        .then((Ledger) => {
            return Ledger.Pad.getPads({
                user: {
                    isAdmin: req.user === 'ADMIN',
                    id: req.user.participantId,
                    role: req.user.role,
                }
            }, {
                padId: req.body.hasOwnProperty('padId') ? req.body.padId : false
            }).then(pad => {
                return res.json({item: pad, user: req.user});
            })
        }).catch((result) => {
            let error = result.error || result.message;
            res.status(500);

            return res.send({success: false, message: rUtils.parseErrorHLF(error)});
        });
});

/******************* END PADS ROUTES *******************/














module.exports = router;