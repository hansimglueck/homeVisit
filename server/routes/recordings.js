(function() {
    'use strict';

    var express = require('express');
    var router = express.Router();
    var queryRecordings = require('../../game/queryRecordings.js')();

    router.get('/', function (req, res, next) {

        queryRecordings.then(function(recordings) {
            res.json(recordings);
        }).done();
    });

    module.exports = router;

})();
