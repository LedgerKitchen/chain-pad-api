let express = require("express");
let router = express.Router();
let LC = require("../modules/LedgerConnector");
let rUtils = require("../modules/rUtils");
let middlewares = require('../modules/middlewares');
let multer = require('multer');
let upload = multer({dest: 'uploads/'});
let IPFSRepository = require('../modules/repo/IPFSRepository');
const IPFS = new IPFSRepository(process.env.IPFS_URL);


/******************* PADS ROUTES *******************/
///pads/new
router.post("/", function (req, res, next) {

    return req.LedgerConnector.init(req.user.networkCard)
        .then((Ledger) => {
            return Ledger.Pad.getPads({
                user: {
                    isAdmin: req.user === 'ADMIN',
                    id: req.user.userId,
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

router.post("/new", function (req, res, next) {

    let files = req.files || [];
    let data = req.body;
    return req.LedgerConnector.init(req.user.networkCard)
        .then((Ledger) => {
            if (data.token) {
                delete data.token
            }
            if(data.fcmId){
                delete data.fcmId;
            }
            if(data.locale){
                delete data.locale;
            }
            return Ledger.Pad.createPad(Object.assign(data, {owner: req.user.userId}))
                .then((result) => {
                    let padId = result.padId;
                    //Adding files IPFS
                    if (files.length) {
                        return IPFS.add(files, true).then(files => {
                            return Ledger.Pad.addFiles({
                                padId: padId,
                                files: files
                            }).then(result => {
                                return res.json(Object.assign(result, {padId: padId}));
                            });
                        }).catch(error => {
                            return res.json({
                                success: true,
                                padId: padId,
                                message: "The pad has been created, but files won't be attached. Please try adding to files from update page.",
                                fileError: rUtils.parseErrorHLF(error)
                            });
                        })
                    }

                    return res.json(result);
                })
        }).catch((result) => {
            let error = result.error || result.message;

            return res.send({success: false, message: rUtils.parseErrorHLF(error)});
        });
});

router.post("/edit", function (req, res, next) {
    let data = req.body,
        files = req.files || [];

    return req.LedgerConnector.init(req.user.networkCard)
        .then((Ledger) => {

            if (!data.padId) {
                throw new Error('Missing required field padId');
            }

            if (data.token) {
                delete data.token
            }

            if(data.fcmId){
                delete data.fcmId;
            }
            if(data.locale){
                delete data.locale;
            }

            return Ledger.Pad.updatePad(data)
                .then((result) => {
                    //Adding files IPFS
                    if (files.length) {
                        return IPFS.add(files, true).then(files => {
                            return Ledger.Pad.addFiles({
                                padId: data.padId,
                                files: files
                            }).then(result => {
                                return res.json(Object.assign(result, {padId: data.padId}));
                            });
                        }).catch(error => {
                            console.log(error);
                            return res.json({
                                success: true,
                                padId: data.padId,
                                message: "The pad has been updated, but files won't be attached. Please try again later.",
                                fileError: rUtils.parseErrorHLF(error)
                            });
                        })
                    }

                    return res.json(Object.assign(result, {padId: data.padId}));
                })
        }).catch((result) => {
            let error = result.error || result.message;

            return res.send({success: false, message: rUtils.parseErrorHLF(error)});
        });
});

router.post("/detail", function (req, res, next) {
    return req.LedgerConnector.init(req.user.networkCard)
        .then((Ledger) => {
            if (!req.body.padId) {
                throw new Error('Missing required field padId');
            }
            return Ledger.Pad.getPads({
                user: {
                    isAdmin: req.user === 'ADMIN',
                    id: req.user.userId,
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

router.post("/accept", function (req, res, next) {
    return req.LedgerConnector.init(req.user.networkCard)
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

router.post("/decline", function (req, res, next) {
    return req.LedgerConnector.init(req.user.networkCard)
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

router.post("/publish", function (req, res, next) {
    return req.LedgerConnector.init(req.user.networkCard)
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

router.post("/delete", function (req, res, next) {
    return req.LedgerConnector.init(req.user.networkCard)
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