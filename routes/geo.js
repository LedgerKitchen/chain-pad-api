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
    return axios({
        url: "https://maps.googleapis.com/maps/api/geocode/json?key=" + process.env.GOOGLE_KEY + "&latlng=" + [data.latitude, data.longitude].join(','),
        method: "get",
        responseType: 'json',
    }).then(response => {

        let address;
        address = response.data.results.filter(function (item) {
            return item.types.indexOf('street_address') > -1;
        });

        return res.send({success: true, address: address[0] || null});

    }).catch(error => {
        //log.error(error.response)
        res.send({success: false, message: error.toString()});
    })
});


module.exports = router;