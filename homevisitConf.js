var _ = require('underscore');

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
    console.log('Found local configuration: homevisitConf.local');
} catch (err) {}

module.exports = conf;
