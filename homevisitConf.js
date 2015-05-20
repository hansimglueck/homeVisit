var _ = require('underscore');
var logger = require('log4js').getLogger();


// defaults
var conf = {
    port: 80,
    bindAddress: '0.0.0.0',
    mongoUri: 'mongodb://localhost/homeVisit',
    pathToApp: '/home/pi/homeVisit/',
    masterMind: false,
    websitePostUri: 'http://USER:PWD@HOSTNAME/PATH'
};

// load local settings if available
try {
    conf = _.extend(conf, require('./homevisitConf.local'));
    logger.info('Found local configuration: homevisitConf.local');
} catch (err) {}

module.exports = conf;
