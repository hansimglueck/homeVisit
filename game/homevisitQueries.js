(function () {
    'use strict';

    var mongoConnection = require('../homevisit_components/mongo/mongoConnection.js');
    var ObjectId = require('mongodb').ObjectID;
    var logger = require('log4js').getLogger();


    function Queries() {
    }

    Queries.prototype = {
        getRecordings: function (callback) {
            mongoConnection(function (db) {
                var recColl = db.collection('recordings');
                recColl.aggregate([
                    {
                        $group: {
                            _id: "$recordingId",
                            sessionId: {$first: "$sessionId"},
                            uploaded: {$max: {$eq: ["$name", "tawanUploadSuccess"]}},
                            recordings: {$push: "$$CURRENT"},
                            count: {$sum: 1},
                            first: {$min: "$absTimestamp"},
                            last: {$max: "$absTimestamp"}
                        }
                    },
                    {
                        $sort: {first: -1}
                    }
                ], function (err, result) {
                    if (err) {
                        logger.error(err);
                    }
                    callback(err, result)
                });
            });
        },
        getCompletedRecordings: function (callback) {
            mongoConnection(function (db) {
                var recColl = db.collection('recordings');
                recColl.aggregate([
                    {
                        $group: {
                            _id: "$recordingId",
                            sessionId: {$first: "$sessionId"},
                            recordings: {$push: "$$CURRENT"},
                            count: {$sum: 1}
                        }
                    },
                    {
                        $match: {
                            $and: [{"recordings.data.uid": 5}, {"recordings.data.uid": 142}]
                        }
                    },
                    {
                        $project: {sessionId: 1, count: 1, recordings: 1}
                    },
                    {
                        $sort: {sessionId: 1}
                    }
                ], function (err, result) {
                    if (err) {
                        logger.error(err);
                    }
                    callback(err, result)
                });
            });
        },
        getNewCompletedRecordings: function (callback) {
            mongoConnection(function (db) {
                    var recColl = db.collection('recordings');
                    recColl.aggregate([
                            {
                                $group: {
                                    _id: "$recordingId",
                                    sessionId: {$first: "$sessionId"},
                                    recordings: {$push: "$$CURRENT"},
                                    count: {$sum: 1}
                                }
                            },
                            {
                                $match: {
                                    $and: [{"recordings.data.uid": 5}, {"recordings.data.uid": 142}],
                                    "recordings.name": {$not: {$eq: "tawanUploadSuccess"}}
                                }
                            },
                            {
                                $project: {sessionId: 1, count: 1}
                            },
                            {
                                $sort: {sessionId: 1}
                            }
                        ],
                        function (err, result) {
                            if (err) {
                                logger.error(err);
                            }
                            //logger.error("getCompletedRecordings:");
                            //logger.error(result);
                            callback(err, result)
                        }
                    )
                    ;
                }
            )
            ;
        },
        getRecording: function (recordingId, callback) {
            mongoConnection(function (db) {
                var recColl = db.collection('recordings');
                recColl.aggregate([
                    {
                        $match: {
                            recordingId: recordingId
                        }
                    },
                    {
                        $group: {
                            _id: "$recordingId",
                            recordings: {$push: "$$CURRENT"},
                            sessionId: {$first: "$sessionId"},
                            count: {$sum: 1}
                        }
                    }
                ], function (err, result) {
                    callback(err, result)
                });
            });
        }
    }
    ;

    module.exports = new Queries();

})
();
