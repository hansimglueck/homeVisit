(function() {
    'use strict';

    var MongoClient = require('mongodb').MongoClient;

    var mongoUri = require('../../homevisitConf').mongoUri;
    var db;

    module.exports = function(cb){
        if (db && cb) {
            cb(db);
            return true;
        }

        MongoClient.connect(mongoUri, function(err, conn) {
            if(err){
                console.log(err.message);
                require('../../game/raspiTools.js').changeMonitoringValue("db", false);
                return false;
            } else {
                require('../../game/raspiTools.js').changeMonitoringValue("db", true);
                db = conn;
                if (cb) {
                    cb(db);
                }
                return true;
            }
        });
    };

})();
