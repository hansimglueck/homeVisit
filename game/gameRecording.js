(function() {
    'use strict';

    var Q = require('q'),
        mongoConnection = require('../homevisit_components/mongo/mongoConnection.js');
    require('colors');

    function GameRecording() {
        this.sessionId = null;
        this.clock = require('./clock');
        this.gameConf = require('./gameConf');
    }

    GameRecording.prototype = {

        reset: function() {
            console.log('gameRecording reset');
        },

        go: function(item) {
            this._recordEvent('go', {
                type: item.type,
                index: item.index
            });
        },

        _recordEvent: function(name, data) {
            var deferred = Q.defer(), self = this,
                sessionId = this.gameConf.conf.session;
            if (typeof sessionId === 'undefined' || sessionId === null) {
                console.log('No session set. Not recording game!'.red);
                return;
            }
            mongoConnection(function(db) { deferred.resolve(db); });
            deferred.promise.then(function(db) {
                var obj = {
                    sessionId: self.gameConf.conf.session,
                    name: name,
                    gameTimestamp: self.clock.getCurrentSeconds(),
                    absTimestamp: Math.floor(new Date().getTime() / 1000)
                };
                if (typeof data !== 'undefined') {
                    obj.data = data;
                }
                var recordingsColl = db.collection('recordings'),
                    insertOne = Q.nbind(recordingsColl.insertOne, recordingsColl);
                return insertOne(obj);
            }).catch(function(err) {
                throw new Error('Error recording game event: ' + err.stack);
            }).done(function() {
                console.log('Recorded game event %s'.format(name).green);
            });
        }

    };

    var gameRecording = new GameRecording();

    module.exports = gameRecording;

})();
