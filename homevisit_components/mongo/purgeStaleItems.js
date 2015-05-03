#!/usr/bin/env node
// removes all item in database which are not referenced by a deck
// BACKUP YOUR DATA BEFORE USING THIS!

var Q = require('q');
var _ = require('underscore');
var mongoConnection = require('./mongoConnection');
require('../stringFormat');
require('colors');

var deferred = Q.defer();
mongoConnection(function(db) { deferred.resolve(db); });
deferred.promise.then(function(db) {
    // find all items
    var itemsColl = db.collection('items');
    var findItems = itemsColl.find(), i = 0;
    var toArrayItems = Q.nbind(findItems.toArray, findItems);
    return toArrayItems().then(function(items) {
        // find all decks
        var findDecks = db.collection('decks').find();
        var toArrayDecks = Q.nbind(findDecks.toArray, findDecks);
        return toArrayDecks().then(function(decks) {
            // check if item is referenced or needs to be removed
            var promises = [];
            items.forEach(function(item) {
                var found = false;
                for (var deckIndex = 0; deckIndex < decks.length; ++deckIndex) {
                    if (decks[deckIndex].items.indexOf(item._id) >= 0) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    // item not referenced anywhere -> remove it!
                    promises.push(
                        Q.nbind(itemsColl.deleteOne, itemsColl)({ _id: item._id }).then(
                            function(r) {
                                if (r.result.ok !== 1 && r.result.n !== 1) {
                                    throw new Error('Could not delete %i'.format(item._id));
                                }
                                return true;
                            }
                        )
                    );
                }
            });
            return Q.allSettled(promises).then(function(results) {
                _.forEach(results, function(r) {
                    if (r.state !== 'fulfilled') {
                        throw new Error(r.reason.stack);
                    }
                });
                return {
                    removedCount: results.length,
                    total: items.length
                }
            }).fin(function() {
                db.close();
            });
        });
    });
}).catch(function(err) {
    throw new Error(err.stack);
}).done(function(results) {
    console.log('Removed %i of %i items.'.format(
        results.removedCount, results.total).green);
});
