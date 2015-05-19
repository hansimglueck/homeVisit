#!/usr/bin/env node

(function() {
  'use strict';

  var fs = require('fs');
  var Q = require('q');
  var _ = require('underscore');
  var mongoConnection = require('./mongoConnection');
  require('colors');
  require('../stringFormat');

  var deferred = Q.defer();
  mongoConnection(function(db) { deferred.resolve(db); });
  deferred.promise.then(function(db) {

    var sort = db.collection('recordings').find({ sessionId: 107 }).sort({ absTimestamp: 1 });
    var toArray = Q.nbind(sort.toArray, sort);

    return toArray().then(function(recordings) {
      _.each(recordings, function(rec) {
        var absDate = new Date(rec.absTimestamp * 1000),
            gameSecs = rec.gameTimestamp, type = (rec.data.type || 'N/A');
        console.log('%10s %s (%6s) %10s: %s'.format(
          rec.data.index || '', absDate, parseInt(gameSecs), rec.name.green, type.red));
      });
    }).then(function() {
      db.close();
    });

  }).catch(function(err) {
    throw new Error(err.stack);
  }).done(function() {
    console.log('DONE');
  });

})();
