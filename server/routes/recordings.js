(function() {
    'use strict';

    var express = require('express');
    var router = express.Router();
    var queryRecordings = require('../../game/queryRecordings.js')();
    var homevisitQueries = require('../../game/homevisitQueries.js')

    router.get('/', function (req, res, next) {
        homevisitQueries.getRecordings(function(err, recordings){
            res.json(recordings);
        });
    });
    router.get('/complete', function (req, res, next) {
        homevisitQueries.getCompletedRecordings(function(err, recordings){
//            res.json(recordings);
            res.render('completeRecordings', {recordings: recordings, title: "abcde"});
        });
    });




    module.exports = router;

})();
