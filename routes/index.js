let express = require('express');
let router = express.Router();
let middlewares = require('../modules/CPMiddlewares');
/* GET home page. */
router.get('/', middlewares.verifyToken, function (req, res, next) {
    return res.send({message: "ChainPad API is Ready!"});
});


module.exports = router;
