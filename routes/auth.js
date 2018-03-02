let express = require('express');
const router = express.Router();
let Ledger = require("../modules/ledger");
let rUtils = require("../modules/rUtils");
let JWT = require("../modules/jwt");
const User = require("../modules/models/user");


/************** Authenticate users **************/
router.post('/login', function (req, res, next) {
    let jwtToken;

    return User.checkUserMongo(req.body, req.body.loginField || 'email')
        .then((user) => {
            if (typeof user.password !== 'undefined') {
                user.password = "<--SECURITY_FIELD-->";
            }
            jwtToken = JWT.createJWToken(user);
            return res.json({user: user, success: true, token: jwtToken});
        })
        .catch((error) => {
            res.status(500);
            return res.json({success: false, message: error.toString()});
        })
});
router.post('/register', function (req, res, next) {
    let jwtToken;

    return Ledger.init(require('config').get('chain-pad')['card'])
        .then((Ledger) => {
            return Ledger.User.createUser(req.body)
                .then((user) => {
                    if (typeof user.User.password !== 'undefined') {
                        user.User.password = "<--SECURITY_FIELD-->";
                    }
                    jwtToken = JWT.createJWToken(user.User);

                    return res.json({user: user.User, success: true, token: jwtToken});
                });
        }).catch((result) => {
            let error = result.error || result.message;
            res.status(403);

            return res.send({success: false, message: rUtils.parseErrorHLF(error)});
        });
});

/************* Logout users *************/
// router.get('/logout', function (req, res, next) {
//     // if (req.session.user) {
//     //     delete req.session.user;
//     // }
//     return res.send({success: true, message: "Success logout", status: 403});
// });

module.exports = router;