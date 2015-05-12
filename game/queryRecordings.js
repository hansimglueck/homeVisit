var mongoConnection = require('../homevisit_components/mongo/mongoConnection.js');
var ObjectID = require('mongodb').ObjectID;
var Q = require('q');
var _ = require('underscore');

module.exports = function () {
    var mongoDeferred = Q.defer();
    mongoConnection(function (db) {
        mongoDeferred.resolve(db);
    });

    return mongoDeferred.promise.then(function (db) {

        var recColl = db.collection('recordings');
        var distinct = Q.nbind(recColl.distinct, recColl);

        // get list of recording ids
        return distinct('recordingId').then(function (recordingIds) {

            var promises = [];
            recordingIds.forEach(function (recordingId) {
                // find session for recording id
                promises.push(
                    Q.nbind(recColl.findOne, recColl)({recordingId: recordingId}).then(
                        function (r) {
                            var sessionsColl = db.collection('sessions');
                            var findSession = Q.nbind(sessionsColl.findOne, sessionsColl);
                            return findSession({_id: ObjectID(r.sessionId)}).then(function (session) {
                                return {
                                    recordingId: r.recordingId,
                                    session: session
                                };
                            });
                        }
                    ).then(function (r) {
                            // find startTime for recording id
                            var recColl = db.collection('recordings');
                            var findStartRecording = Q.nbind(recColl.findOne, recColl);
                            return findStartRecording({
                                recordingId: r.recordingId,
                                "data.uid": 5
                            }).then(function (startRecording) {
                                r.startTimestamp = (startRecording !== null) ? startRecording.absTimestamp : -1;
                                return r;
                            });
                        }
                    ).then(function (r) {
                            // find stopTime for recording id
                            var recColl = db.collection('recordings');
                            var findStartRecording = Q.nbind(recColl.findOne, recColl);
                            return findStartRecording({"data.uid": 142}).then(function (stopRecording) {
                                r.stopTimestamp = (stopRecording !== null) ? stopRecording.absTimestamp : -1;
                                return r;
                            });
                        }
                    ).then(function (r) {
                            // find uploadedRecording for recording id
                            var uploadedRecordingsColl = db.collection('uploadedRecordings');
                            var findUploadedRecording = Q.nbind(uploadedRecordingsColl.findOne, uploadedRecordingsColl);
                            return findUploadedRecording({recordingId: recordingId}).then(function (uploadedRecording) {
                                r.uploaded = (uploadedRecording !== null) ? uploadedRecording.success : false;
                                r.lastTry = (uploadedRecording !== null) ? uploadedRecording.uploadTime : null;
                                return r;

                            });
                        }
                    )
                );
            });

            return Q.allSettled(promises).then(function (results) {
                _.forEach(results, function (r) {
                    if (r.state !== 'fulfilled') {
                        throw new Error(r.reason.stack);
                    }
                });
                return _.pluck(results, 'value');
            });

        });
    }).catch(function (err) {
        console.log('ERROR:', err);
    });

};
