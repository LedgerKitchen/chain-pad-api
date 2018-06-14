let express = require('express');
let router = express.Router();
let middlewares = require('../modules/CPMiddlewares');
let fcm = require('../modules/repo/lib/FCM');

/* GET home page. */
router.get('/', middlewares.verifyToken, function (req, res, next) {
    return res.send({message: "ChainPad API is Ready!"});
});

router.post('/test-fcm', [middlewares.verifyToken, middlewares.createHLFConnection], function (req, res, next) {
    let arData = {
            device: false,
            text: 'This default text message!',
            data: {}
        },
        data = req.body;

    if (data.fcmId) {
        arData.device = data.fcmId;
    }

    if (!arData.device && req.user.device) {
        arData.device = req.user.device;
    }

    if (typeof arData.device === 'string') {
        arData.device = [arData.device];
    }

    if (data.data) {
        arData.data = data.data;
    }

    arData.text = data.text || arData.text;

    fcm.sendMessage(arData.device, arData, function (result) {
        console.log(result);
        res.json(result);
    });
});


module.exports = router;
