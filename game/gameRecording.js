(function() {
    'use strict';

    var Q = require('q');

    function GameRecording() {
        this.sessionId = null;
        this.clock = require('./clock');
    }

    GameRecording.prototype = {

        reset: function() {
            console.log('gameRecording reset');
        },

        recordEvent: function(name, data) {
            console.log('recording game event', name);
            var deferred = Q.defer();
            mongoConnection(function(db) { deferred.resolve(db); });
            deferred.promise.then(function(db) {
                db.collections('recordings').insertOne({
                    sessionId: this,
                    name: name,
                    data: data
                });
            });
        }

    };

    var gameRecording = new GameRecording();

    module.exports = gameRecording;

})();
