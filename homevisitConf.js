var _ = require('underscore');

// defaults
var conf = {
    port: 80,
    mongoUri: 'mongodb://localhost/homeVisit'
};

// load local settings if available
try {
    conf = _.extend(conf, require('./homevisitConf.local'));
    console.log('Found local configuration: homevisitConf.local');
} catch (err) {}

module.exports = conf;
