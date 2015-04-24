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
            if (_.any(results, function(r) { return r.value > 0; })) {
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
                insertMany = Q.nbind(c.insertMany, c);
                promises.push(insertMany(collData));
            });
            return Q.allSettled(promises)
                .then(function() {
                    console.log('Successfully restored data from %s.'.format(
                        restoreFilename).green);
                });
        })
        .catch(function(err) {
            console.error('Error inserting data!'.red);
            throw new Error(err.stack);
        }).fin(function() {
            db.close();
        }).done();
});
