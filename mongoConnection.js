var MongoClient = require('mongodb').MongoClient;
var db;

module.exports = function(cb){
    if(db){
        if (cb) cb(db);
        return true;
    }

    MongoClient.connect('mongodb://localhost/homeVisit', function(err, conn) {
        if(err){
            console.log(err.message);
            return false;
            //throw new Error(err);
        } else {
            db = conn;
            if (cb) cb(db);
            return true;
        }
    });
};