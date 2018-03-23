let express = require("express");
let router = express.Router();
let middlewares = require('../modules/middlewares');
let Ledger = require("../modules/ledger");
let rUtils = require("../modules/rUtils");

router.get("/list", [middlewares.verifyToken], function (req, res, next) {
    Ledger.init(req.user.networkCard).then((Ledger) => {
        let fnStr = req.user.role === 'ADMIN' ? 'getAllHistory' : 'getAllHistoryByCurrentParticipant';
        let fn = {
            getAllHistory: Ledger.History.getAllHistory(),
            getAllHistoryByCurrentParticipant: Ledger.History.getAllHistoryByCurrentParticipant(),
        };
        fn[fnStr].then((histories) => {
            return res.json({items: histories, user: req.user});
        }).catch((result) => {
            let error = result.error || result.message;
            return res.send({success: false, message: rUtils.parseErrorHLF(error)});
        });
    });
});


module.exports = router;