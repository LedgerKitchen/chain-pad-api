const log4js = require('log4js');
const log = log4js.getLogger();
log.level = 'debug';

module.exports = {
    info: function (message) {
        return log.info(message);
    },
    debug: function (message) {
        return log.debug(message);
    },
    error: function (message) {
        return log.error(message);
    },
    trace: function (message) {
        return log.trace(message);
    },
    warn: function (message) {
        return log.warn(message);
    },
    fatal: function (message) {
        return log.fatal(message);
    }
};