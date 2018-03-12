const JWT = require('./jwt');
const log = require('./logger.js');

module.exports = {
    verifyToken: function (req, res, next) {
        let token = req.body.token || req.query.token || req.header('token');
        log.debug('Token Catch ----> ' + token);
        JWT.verifyJWTToken(token)
            .then((decodedToken) => {
                req.user = decodedToken.data;
                req.user.participantId = req.user.networkCard.split('@')[0];
                next()
            })
            .catch((err) => {
                res.status(403)
                    .json({success: false, message: "Invalid auth token provided."})
            })
    }
};