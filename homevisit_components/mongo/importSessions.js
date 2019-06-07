#!/usr/bin/env node
// Imports sessions from JSON

(function() {
    'use strict';

    var http = require('https'),
        Q = require('q'),
        _ = require('underscore'),
        mongoConnection = require('./mongoConnection');
    require('../stringFormat');
    require('colors');

    // parse args
    var args = process.argv.slice(2), url = args[0];
    if (typeof url === 'undefined') {
        console.error('Error: No URL given!'.red);
        process.exit(1);
    }

    function parseJson(jsonData) {
        var jsonObj = JSON.parse(jsonData);
        console.log(jsonObj);
    }

    var mongoDeferred = Q.defer();
    mongoConnection(function(db) { mongoDeferred.resolve(db); });
    mongoDeferred.promise.then(function(db) {
        // download data
        console.log('Fetching data from server...');
        var httpDeferred = Q.defer();
        http.get(url, function(res) {

            if (res.statusCode !== 200) {
                httpDeferred.reject(
                    new Error('Could not fetch data. (Status code: %i)'.format(
                        res.statusCode)));
            }

            var jsonData = '';
            res
                .on('data', function(chunk) {
                    jsonData += chunk;
                })
                .on('end', function() {
                    httpDeferred.resolve(JSON.parse(jsonData));
                });
        }).on('error', function(e) {
            httpDeferred.reject(new Error(e));
        }).end();
        return httpDeferred.promise.then(function(sessions) {
            // process objects
            var promises = _.map(sessions, function(session) {
                var sessionsColl = db.collection('sessions');
                var update = Q.nbind(sessionsColl.update, sessionsColl);
                session.sessionId = session.id;
                delete session.id;
                return update({ sessionId: session.sessionId }, session, { upsert: true });
            });
            return Q
                .all(promises)
                .fin(function() {
                    db.close();
                });
        });
    }).catch(function(err) {
        throw new Error(err.stack);
    }).done(function(a) {
        console.log('Done! Imported %i sessions.'.format(a.length).green);
    });

})();
