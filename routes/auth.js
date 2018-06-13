let express = require('express');
const router = express.Router();
let CPUtils = require("../modules/CPUtils");
let JWT = require("../modules/JWT");
let log = require("../modules/CPLogger");
let middlewares = require("../modules/CPMiddlewares");
const User = require("../modules/repo/userRepository");
const SMS = require("../modules/repo/smsCodeRepository");


/************** Authenticate users **************/

router.post('/send-sms', function (req, res, next) {
    let data = req.body;
    data.phone = data.phone.replace(/[^0-9]/gim, '');
    return SMS.add(data.phone)
        .then(code => {

            if (data.phone.substring(0, 4) === '7000' && process.env.DEBUG) {
                return res.json({success: true, code: code})
            }

            log.info('Code has been sent -> ' + code);
            return SMS.send(req.body.phone, code, data.countryCode || null).then((SMSSend) => {
                if (SMSSend.success) {
                    return res.json({success: true});
                } else {
                    return SMS.remove(data.phone).then(() => {
                        return res.json({success: false, message: SMSSend.message});
                    });
                }
            });
        }).catch(err => {
            let error = err.message || {};

            //Duplicate
            if (err.code === 11000) {
                error = "Re-sending is possible not more than 1 time in 120 seconds";
            }

            return res.json({success: false, message: error.toString()});
        })
});

router.post('/sign-in', middlewares.createHLFConnection, function (req, res, next) {
    let jwtToken;
    let data = req.body;
    data.phone = data.phone.replace(/[^0-9]/gim, '');

    return SMS.get(data.phone, data.code).then(() => {
        return SMS.remove(data.phone).then(() => {
            return User.checkUserMongo(data).then(result => {
                if (result.user) {
                    jwtToken = JWT.createJWToken(result.user);

                    return res.json({user: result.user, success: true, token: jwtToken});
                } else {
                    return req.LedgerConnector.init(process.env.CARD)
                        .then((Ledger) => {
                            return Ledger.User.createUser(data)
                                .then((result) => {
                                    jwtToken = JWT.createJWToken(result.user);
                                    return res.json({user: result.user, success: true, token: jwtToken});
                                });
                        }).catch((result) => {
                            let error = result.error || result.message;

                            return res.send({
                                success: false,
                                message: CPUtils.parseErrorHLF(error),
                                httpErrorCode: 403,
                            });
                        });
                }
            })
        })
    }).catch(error => {
        return res.json({success: false, message: error.toString(), httpErrorCode: 403});
    });
});

module.exports = router;