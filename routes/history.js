let express = require("express");
let router = express.Router();
let CPUtils = require("../modules/CPUtils");

router.get("/list", function (req, res, next) {

    req.LedgerConnector.init(req.user.networkCard).then((Ledger) => {
        let fnStr = req.user.role === 'ADMIN' ? 'getAllHistory' : 'getAllHistoryByCurrentParticipant';
        let fn = {
            getAllHistory: Ledger.History.getAllHistory(),
            getAllHistoryByCurrentParticipant: Ledger.History.getAllHistoryByCurrentParticipant(),
        };

        fn[fnStr].then((histories) => {
            return res.json({items: histories, user: req.user});
        }).catch((result) => {
            let error = result.error || result.message;
            return res.send({success: false, message: CPUtils.parseErrorHLF(error)});
        });
    });
});


module.exports = router;