(function() {
    'use strict';

    var router = require('express').Router();

    var masterMind = require('../masterMind');

    router.get('/', function (req, res, next) {
        masterMind.getNodes().then(function(nodes) {
            res.json(nodes);
        }).catch(function(err) {
            next(err);
        }).done();
    });

    module.exports = router;

})();
