var mongoUri = require('../homevisitConf').mongoUri;

var MongoClient = require('mongodb').MongoClient;

var mongoUri = require('../homevisitConf').mongoUri;
var db;

module.exports = function(cb){
    if(db && cb) {
        cb(db);
        return true;
    }

    MongoClient.connect(mongoUri, function(err, conn) {
        if(err){
            console.log(err.message);
            return false;
        } else {
            db = conn;
            if (cb) cb(db);
            return true;
        }
    });
};
