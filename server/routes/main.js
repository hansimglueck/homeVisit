(function() {
    'use strict';

    var router = require('express').Router();
    var game = require('../../game/game.js');
    var gameConf = require('../../game/gameConf.js');
    var conf = require('../../homevisitConf');
    var rootRoute = '/player';

    // Normal mode
    if (!conf.masterMind) {
        router.get('/log', function(req, res, next) {
            var results = [];
            Object.keys(game.sequence.polls).forEach(function(poll){
                var res = null;
                try {
                    res = game.sequence.polls[poll].getResult();
                }
                catch (e) {}
                results.push(res);
            });
            console.log(game.sequence);
            var sequence = game.sequence.getExecuteTime();
            console.log("seq:"+sequence);
            res.json({sequence: sequence, results: results});
        });

    }
    // Master mind mode
    else {
        router.get('/mastermind', function(req, res, next) {
            res.sendFile('index.html', { root: __dirname + '/../../admin' });
        });
        rootRoute = '/mastermind/';
    }

    router.get('/', function(req, res, next) {
        res.redirect(rootRoute);
    });
    router.get('/emulator', function(req, res, next) {
        res.render('emulator');
    });

    module.exports = router;

})();
