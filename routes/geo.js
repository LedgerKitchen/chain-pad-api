let express = require('express');
const router = express.Router();
let rUtils = require("../modules/rUtils");
let log = require("../modules/logger");
let axios = require("axios");


/************** Authenticate users **************/
//
router.all('/getAddressByPoints', function (req, res, next) {
    let data = req.body;

    if (!data.latitude || !data.longitude) {
        return res.send({success: false, message: "Coordinates weren't set, please set their."});
    }

    rUtils.getAddressByPoints(data).then(address => {
        return res.send({success: true, address: address});
    }).catch(error => {
        res.send({success: false, message: error.toString()});
    })
});


module.exports = router;