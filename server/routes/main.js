(function() {
    'use strict';

    var router = require('express').Router();
    var game = require('../../game/game.js');

    router.get('/', function(req, res, next) {
        res.redirect('/player');
    });

    router.get('/admin', function(req, res, next) {
        res.sendFile('index.html', { root: __dirname + '/../../admin' });
    });

    router.get('/player', function(req, res, next) {
        res.sendFile('index.html', { root: __dirname + '/../../player' });
    });

    router.get('/mc', function(req, res, next) {
        res.sendFile('mc/index.html', { root: __dirname +"/../public"  });
    });

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

    router.get('/emulator', function(req, res, next) {
        res.render('emulator');
    });

    module.exports = router;

})();
