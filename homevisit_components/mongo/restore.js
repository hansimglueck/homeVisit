#!/usr/bin/env node

var mongoConnection = require('./mongoConnection'),
    fs = require('fs'),
    colors = require('colors'),
    _ = require('underscore'),
    Q = require('q');
require('../stringFormat');

// parse arguments
var args = process.argv.slice(2),
   restoreFilename = args[0];
if (typeof restoreFilename === 'undefined') {
    console.error('Please specify a restore file!'.red);
    process.exit(1);
}

mongoConnection(function(db) {
    var collections = ['gameconfs', 'decks', 'items'];

    // first check if database is really empty
    var countPromises = [];
    collections.forEach(function(coll) {
        var count = Q.nbind(db.collection(coll).count, db.collection(coll));
        countPromises.push(count());
    });
    Q.allSettled(countPromises)
        .then(function(results) {
            if (_.any(results, function(r) {
                return r.value > 0 || r.state !== 'fulfilled';
            })) {
                throw new Error('Refusing to import into non-empty database!'.red);
            }
        })
        // load and parse json dump
        .then(function() {
            var promises = [],
                dumpObj = JSON.parse(fs.readFileSync(restoreFilename, 'utf-8'));
            collections.forEach(function(coll) {
                // insert collections
                var collData = dumpObj[coll],
                    c = db.collection(coll),
                    insertOne = Q.nbind(c.insertOne, c);
                collData.forEach(function(doc) {
                    promises.push(insertOne(doc));
                });
            });
            return Q.allSettled(promises)
                .then(function(results) {
                    var dupCount = 0;
                    var failed = _.filter(results, function(r) {
                        if (r.state !== 'fulfilled') {
                            if (r.reason.name === 'MongoError' &&
                                !r.reason.errmsg.match(/E11000 duplicate key error/)) {
                                return true;
                            } else {
                                ++dupCount;
                            }
                        }
                        return false;
                    });
                    if (failed.length > 0) {
                        _.each(failed, function(r) {
                              console.dir(r);
                        });
                        throw new Error('Could not insert documents!'.red);
                    }
                    console.log('Successfully restored data from %s.'.format(
                        restoreFilename).green);
                    if (dupCount > 0) {
                        console.log('Warning: Ignored %d duplicates...'.format(
                            dupCount).yellow);
                    }
                });
        })
        .catch(function(err) {
            console.error('Error inserting data!'.red);
            throw new Error(err.stack);
        }).fin(function() {
            db.close();
        }).done();
});
