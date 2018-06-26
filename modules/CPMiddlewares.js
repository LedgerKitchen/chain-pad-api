const JWT = require('./JWT');
const log = require('./CPLogger.js');
const User = require('./repo/userRepository');
const CPLedger = require("./CPLedger");
const CPUtils = require('./CPUtils');


module.exports = {
    verifyToken: function (req, res, next) {
        let token = req.body.token || req.query.token || req.header('token');
        JWT.verifyJWTToken(token).then((decodedToken) => {
            return User.getUserMongo({phone: decodedToken.data.phone}, 'phone');
        }).then(user => {
            req.user = user.toObject();
            if (process.env.DEBUG) {
                console.info('<===> Data which was parsed from JWT <===>');
                console.log(req.user);
                console.info('<===> End data <===>');
            }
            return next()
        }).catch(error => {
            res.json({success: false, message: "Invalid auth token provided.", httpErrorCode: 403});
        })
    },
    onlyAdminAccess: function (req, res, next) {

        if (req.user.role === 'ADMIN') {
            return next()
        }

        return res.json({success: false, message: "Access denied (Only Admin).", httpErrorCode: 403});
    },
    cacheInit: function (req, res, next) {
        req.CPCache = req.app.CacheService;
        return next()
    },
    createHLFConnection: function (req, res, next) {
        req.CPLedger = new CPLedger(req.CPCache);
        return next()
    }
};