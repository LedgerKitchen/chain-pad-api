const JWT = require('./jwt');
const log = require('./logger.js');
const User = require('./repo/userRepository');
const LC = require("./LedgerConnector");
const rUtils = require('./rUtils');
module.exports = {
    verifyToken: function (req, res, next) {
        let token = req.body.token || req.query.token || req.header('token');
        log.debug('Token Catch ----> ' + token);
        JWT.verifyJWTToken(token).then((decodedToken) => {
            return User.getUserMongo({phone: decodedToken.data.phone}, 'phone');
        }).then(user => {
            req.user = user.toObject();
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
    createHLFConnection: function (req, res, next) {
        req.LedgerConnector = new LC();
        return next()
    }
};