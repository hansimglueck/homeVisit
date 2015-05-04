#!/usr/bin/env node

(function() {
    'use strict';

    var fs = require('fs');
    var Q = require('q');
    var _ = require('underscore');
    var mongoConnection = require('./mongoConnection');
    require('../stringFormat');
    require('colors');

    // parse args
    var args = process.argv.slice(2),
        filename = args[0];
    if (typeof filename === 'undefined') {
        console.error('Error: No filename given!'.red);
        process.exit(1);
    }

    var deferred = Q.defer();
    mongoConnection(function(db) { deferred.resolve(db); });
    deferred.promise.then(function(db) {

        var lines = fs.readFileSync(filename).toString().split('\n'),
            promises = [], session,
            sessionsColl = db.collection('sessions'),
            update = Q.nbind(sessionsColl.update, sessionsColl);

        while (lines.length > 0) {
            session = {
                _id: parseInt(lines.shift().trim()),
                date: lines.shift().trim(),
                time: lines.shift().trim(),
                bezirk: lines.shift().trim(),
                city: lines.shift().trim()
            };
            lines.shift();
            promises.push(update({ _id: session._id }, session, { upsert: true }));
        }

        return Q.allSettled(promises).then(function(results) {
            _.forEach(results, function(r) {
                if (r.state !== 'fulfilled') {
                    throw new Error(r.reason.stack);
                }
            });
            db.close();
            return results.length;
        });
    }).catch(function(err) {
        throw new Error(err.stack);
    }).done(function(count) {
        console.log('Imported %d sessions'.format(count));
    });

})();
