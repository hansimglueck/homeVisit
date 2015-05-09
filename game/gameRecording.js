(function() {
    'use strict';
    var mit = require('./makeItTawan');

    var http = require('http'),
        url = require('url'),
        querystring = require('querystring'),
        Q = require('q'),
        hat = require('hat'),
        mongoConnection = require('../homevisit_components/mongo/mongoConnection.js');

    function GameRecording() {
        this.recordingId = null;
        this.clock = require('./clock');
        this.gameConf = require('./gameConf');
        this.uid = null;
    }

    GameRecording.prototype = {

        reset: function() {
            console.log('gameRecording reset');
            this.recordingId = hat();
        },

        go: function(item) {
            this.uid = item.uid;
            this._recordEvent('go', {
                type: item.type,
                index: item.index
            });
        },

        score: function(score) {
            this._recordEvent('score', score);
        },

        poll: function(data) {
            this._recordEvent('poll', {
                type: data.voteType,
                results: data
            });
        },

        agreement: function(agreement) {
            this._recordEvent('agreement', {
                type: agreement.agreementType,
                playerIds: agreement.playerIds
            });
        },

        deal: function(deal) {
            this._recordEvent('deal', deal);
        },

        answers: function(answers) {
            console.log("RECORDING ANSWERS-----------------------");
            this._recordEvent('answers', answers);
        },

        _recordEvent: function(name, data) {
            data.uid = this.uid;
            var deferred = Q.defer(), self = this,
                sessionId = this.gameConf.conf.session;
            if (typeof sessionId === 'undefined' || sessionId === null) {
                console.log('No session set. Not recording game!');
                return;
            }
            mongoConnection(function(db) { deferred.resolve(db); });
            deferred.promise.then(function(db) {
                var obj = {
                    recordingId: self.recordingId,
                    sessionId: self.gameConf.conf.session,
                    name: name,
                    gameTimestamp: self.clock.getCurrentSeconds(),
                    absTimestamp: Math.floor(new Date().getTime() / 1000),
                    data: data
                };
                var recordingsColl = db.collection('recordings'),
                    insertOne = Q.nbind(recordingsColl.insertOne, recordingsColl);
                return insertOne(obj);
            }).catch(function(err) {
                throw new Error('Error recording game event: ' + err.stack);
            }).done(function() {
                console.log('Recorded game event %s'.format(name));
            });
        },

        upload: function(id, sid) {
            mit(id, sid, function(tawan){
                var postUrl = require('../homevisitConf').websitePostUrl;
                var u = url.parse(postUrl);
                var json = JSON.stringify(tawan);
                //kann scheinbar keinen objekt mit objekten drin stringifien...
                var postData = querystring.stringify({json_daten:json, valide_test_2:"valide_test_2"});
                console.log(json);
                console.log(postData);
                var opts = {
                    host: u.host,
                    path: u.path,
                    auth: u.auth,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Content-Length': postData.length
                    }
                };

                var req = http.request(opts, function(res) {
                    res.setEncoding('utf8');
                    res.on('data', function(chunk) {
                        console.log('Response: ' + chunk);
                    });
                });
                req.write(postData);
                req.end();
            });
        }

    };

    var gameRecording = new GameRecording();

    module.exports = gameRecording;

})();
