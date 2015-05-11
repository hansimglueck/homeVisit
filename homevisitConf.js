var _ = require('underscore');

// defaults
var conf = {
    port: 80,
    lan: false, //used to check if we have to ask fpr authentication
    mongoUri: 'mongodb://localhost/homeVisit',
    pathToApp: '/home/pi/homeVisit/'
};

// load local settings if available
try {
    conf = _.extend(conf, require('./homevisitConf.local'));
    console.log('Found local configuration: homevisitConf.local');
} catch (err) {}

module.exports = conf;
