#!/usr/bin/env node

var mongoConnection = require('./mongoConnection'),
    fs = require('fs'),
    colors = require('colors'),
    _ = require('underscore'),
    Q = require('q');
require('../stringFormat');

// parse arguments
var args = process.argv.slice(2),
   dumpFilename = args[0];
if (typeof dumpFilename === 'undefined') {
    console.error('Error: No dump file given!'.red);
    process.exit(1);
}

mongoConnection(function(db) {
    // get all entries in collections
    var collections = ['gameconfs', 'decks', 'items'],
        promises = [];
    collections.forEach(function(coll) {
        var find = db.collection(coll).find();
        var toArray = Q.nbind(find.toArray, find);
        promises.push(toArray().then(function(entries) {
            return {
                name: coll,
                entries: entries
            };
        }));
    });

    Q.allSettled(promises)
        // to json
        .then(function(results) {
            var dump = {};
            collections.forEach(function(coll) {
                dump[coll] = _.find(results, function(r) {
                    return r.value.name === coll;
                }).value.entries
            });
            return JSON.stringify(dump);
        })
        // write file
        .then(function(jsonDump) {
            var writeFile = Q.denodeify(fs.writeFile);
            return writeFile(dumpFilename, jsonDump);
        })
        // done!
        .then(function() {
            console.log('Successfully written to %s'.format(dumpFilename).green);
        })
        .catch(function(err) {
            console.error('Error dumping data'.red);
            throw new Error(err.stack);
        }).fin(function() {
            db.close();
        }).done();
});
