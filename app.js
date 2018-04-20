let express = require('express');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let multer = require('multer');
let middlewares = require('./modules/middlewares');

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
let filesUpload = multer({storage: storage});

let app = express();

app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());

let onFinished = require('on-finished');

app.use(function (req, res, next) {
    onFinished(res, function () {
        if (typeof  req.LedgerConnector !== 'undefined') {
            req.LedgerConnector.close();
        }
    });
    next();
});

/******************* ROUTES *******************/
app.use('/', require('./routes/index'));

app.use('/auth', require('./routes/auth'));
app.use('/history', [middlewares.verifyToken, middlewares.createHLFConnection], require('./routes/history'));//This only preview version
app.use('/users', [middlewares.verifyToken, middlewares.createHLFConnection], require('./routes/users'));
app.use('/pads', [filesUpload.array('padFiles'), middlewares.verifyToken, middlewares.createHLFConnection], require('./routes/pads'));
app.use('/pads/file', [middlewares.verifyToken, middlewares.createHLFConnection], require('./routes/files'));
app.use('/pads/geo', [middlewares.verifyToken, middlewares.createHLFConnection], require('./routes/geo'));
/******************* END ROUTES *******************/

/******************* CATCH ERRORS *******************/
app.use(function (req, res, next) {
    res.status(404);
    res.send({success: false, message: '404 Path not found'});
    return;
});
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send({success: false, message: err.message});
    return;
});
/******************* END CATCH ERRORS *******************/

module.exports = app;
