let express = require('express');
const router = express.Router();
let CPUtils = require("../modules/CPUtils");
let log = require("../modules/CPLogger");
let axios = require("axios");


/************** Authenticate users **************/
//
router.all('/getAddressByPoints', function (req, res, next) {
    let data = req.body;

    if (!data.latitude || !data.longitude) {
        return res.send({success: false, message: "Coordinates weren't set, please set their."});
    }

    req.CPCache.store('geo-' + data.latitude + '#' + data.longitude, () => CPUtils.getAddressByPoints(data)).then(address => {
        return res.send({success: true, address: address});
    }).catch(error => {
        res.send({success: false, message: error.toString()});
    })
});


module.exports = router;