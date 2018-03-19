let express = require('express');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');

let app = express();

app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());



/******************* ROUTES *******************/
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/history', require('./routes/history'));//This only preview version
app.use('/users', require('./routes/users'));
app.use('/pads', require('./routes/pads'));
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
