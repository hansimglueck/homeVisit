(function() {
    'use strict';

    var express = require('express');
    var router = express.Router();
    var mongoConnection = require('../../homevisit_components/mongo/mongoConnection.js');
    var ObjectID = require('mongodb').ObjectID;
    var Q = require('q');
    var _ = require('underscore');

    router.get('/', function (req, res, next) {

        var mongoDeferred = Q.defer();
        mongoConnection(function(db) { mongoDeferred.resolve(db); });

        mongoDeferred.promise.then(function(db) {

            var recColl = db.collection('recordings');
            var distinct = Q.nbind(recColl.distinct, recColl);

            // get list of recording ids
            return distinct('recordingId').then(function(recordingIds) {

                var promises = [];
                recordingIds.forEach(function(recordingId) {
                    // find session for recording id
                    promises.push(
                        Q.nbind(recColl.findOne, recColl)({ recordingId: recordingId }).then(
                            function(r) {
                                var sessionsColl = db.collection('sessions');
                                var findSession = Q.nbind(sessionsColl.findOne, sessionsColl);
                                return findSession({ _id: r.sessionId }).then(function(session) {
                                    return {
                                        recordingId: r.recordingId,
                                        session: session
                                    };
                                });
                            }
                        )
                    );
                });

                return Q.allSettled(promises).then(function(results) {
                    _.forEach(results, function(r) {
                        if (r.state !== 'fulfilled') {
                            throw new Error(r.reason.stack);
                        }
                    });
                    return _.pluck(results, 'value');
                });

            });
        }).catch(function(err) {
            console.log('ERROR:', err);
        }).done(function(recordings) {
            res.json(recordings);
        });
    });

    module.exports = router;

})();
