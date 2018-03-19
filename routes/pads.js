let express = require("express");
let router = express.Router();
let Ledger = require("../modules/ledger");
let rUtils = require("../modules/rUtils");
let middlewares = require('../modules/middlewares');

/******************* PADS ROUTES *******************/
///assets/pads/new
router.post("/", middlewares.verifyToken, function (req, res, next) {

    return Ledger.init(req.user.networkCard)
        .then((Ledger) => {
            return Ledger.Pad.getPads({
                user: {
                    isAdmin: req.user === 'ADMIN',
                    id: req.user.participantId,
                    role: req.user.role,
                }
            }).then(pads => {
                return res.json({success: true, items: pads, user: req.user});
            })
        }).catch((result) => {
            let error = result.error || result.message;

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

            return res.send({success: false, message: rUtils.parseErrorHLF(error)});
        });
});

router.post("/edit", middlewares.verifyToken, function (req, res, next) {

    return Ledger.init(req.user.networkCard)
        .then((Ledger) => {
            if (!req.body.padId) {
                throw new Error('Missing required field padId');
            }
            return Ledger.Pad.updatePad(req.body)
                .then((result) => {
                    return res.json(result);
                });
        }).catch((result) => {
            let error = result.error || result.message;

            return res.send({success: false, message: rUtils.parseErrorHLF(error)});
        });
});

router.post("/detail", middlewares.verifyToken, function (req, res, next) {
    return Ledger.init(req.user.networkCard)
        .then((Ledger) => {
            if (!req.body.padId) {
                throw new Error('Missing required field padId');
            }
            return Ledger.Pad.getPads({
                user: {
                    isAdmin: req.user === 'ADMIN',
                    id: req.user.participantId,
                    role: req.user.role,
                }
            }, {
                padId: req.body.padId || false
            }).then(pad => {
                return res.json({success: true, item: pad, user: req.user});
            })
        }).catch((result) => {
            let error = result.error || result.message;

            return res.send({success: false, message: rUtils.parseErrorHLF(error)});
        });
});

router.post("/accept", middlewares.verifyToken, function (req, res, next) {
    return Ledger.init(req.user.networkCard)
        .then((Ledger) => {
            if (!req.body.padId) {
                throw new Error('Missing required field padId');
            }
            return Ledger.Pad.acceptPad({
                padId: req.body.padId
            }).then(result => {
                return res.json(result);
            })
        }).catch((result) => {
            let error = result.error || result.message;

            return res.send({success: false, message: rUtils.parseErrorHLF(error)});
        });
});

router.post("/decline", middlewares.verifyToken, function (req, res, next) {
    return Ledger.init(req.user.networkCard)
        .then((Ledger) => {
            if (!req.body.padId) {
                throw new Error('Missing required field padId');
            }
            return Ledger.Pad.declinePad({
                padId: req.body.padId
            }).then(result => {
                return res.json(result);
            })
        }).catch((result) => {
            let error = result.error || result.message;

            return res.send({success: false, message: rUtils.parseErrorHLF(error)});
        });
});

router.post("/publish", middlewares.verifyToken, function (req, res, next) {
    return Ledger.init(req.user.networkCard)
        .then((Ledger) => {
            if (!req.body.padId) {
                throw new Error('Missing required field padId');
            }
            return Ledger.Pad.publishPad({
                padId: req.body.padId
            }).then(result => {
                return res.json(result);
            })
        }).catch((result) => {
            let error = result.error || result.message;

            return res.send({success: false, message: rUtils.parseErrorHLF(error)});
        });
});

router.post("/delete", middlewares.verifyToken, function (req, res, next) {
    return Ledger.init(req.user.networkCard)
        .then((Ledger) => {
            if (!req.body.padId) {
                throw new Error('Missing required field padId');
            }
            return Ledger.Pad.deletePad({
                padId: req.body.padId
            }).then(result => {
                return res.json(result);
            })
        }).catch((result) => {
            let error = result.error || result.message;

            return res.send({success: false, message: rUtils.parseErrorHLF(error)});
        });
});

/******************* END PADS ROUTES *******************/














module.exports = router;