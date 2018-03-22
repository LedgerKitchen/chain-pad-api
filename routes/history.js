let express = require("express");
let router = express.Router();
let middlewares = require('../modules/middlewares');
let Ledger = require("../modules/ledger");
let rUtils = require("../modules/rUtils");

router.get("/list", [middlewares.verifyToken, middlewares.onlyAdminAccess], function (req, res, next) {
    Ledger.init(req.user.networkCard).then((Ledger) => {
        Ledger.History.getAllHistory().then((histories) => {
            return res.json({items: histories, user: req.user});
        }).catch((result) => {
            let error = result.error || result.message;
            return res.send({success: false, message: rUtils.parseErrorHLF(error)});
        });
    });
});


module.exports = router;