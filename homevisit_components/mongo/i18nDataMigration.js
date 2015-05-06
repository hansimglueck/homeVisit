#!/usr/bin/env node

(function() {
    'use strict';

    // data migration: move translatable texts into new data structure:
    // e.g. item.text = '' -> item.text.de = ''

    var Q = require('q');
    var _ = require('underscore');
    var mongoConnection = require('./mongoConnection');
    require('../stringFormat');

    function transformItem(item) {
        if (typeof item.text === 'string') {
            item.text = { de: item.text };
        }
        if (typeof item.mcnote === 'string') {
            item.mcnote = { de: item.mcnote };
        }
        if (typeof item.voteOptions !== 'undefined') {
            _.forEach(item.voteOptions, function(voteOption) {
                if (typeof voteOption.text === 'string') {
                    voteOption.text = { de: voteOption.text };
                }
            });
        }
        if (typeof item.inlineDecks !== 'undefined') {
            _.forEach(item.inlineDecks, function(deck) {
                _.forEach(deck.items, transformItem);
            });
        }
        return item;
    }

    function processDbItem(db, item) {
        var updateOne = Q.nbind(db.collection('items').updateOne, db.collection('items'));
        return updateOne({ _id: item._id }, transformItem(item));
    }

    var deferred = Q.defer();
    mongoConnection(function(db) { deferred.resolve(db); });
    deferred.promise.then(function(db) {
        var findItems = db.collection('items').find();
        var toArray = Q.nbind(findItems.toArray, findItems);

        return toArray()
            .then(function(items) {
                var promises = _.map(items, function(item) {
                    return processDbItem(db, item);
                });
                return Q.allSettled(promises).then(function(results) {
                    _.forEach(results, function(r) {
                        if (r.state !== 'fulfilled') {
                            throw new Error(r.reason.stack);
                        }
                    });
                    db.close();
                    return results.length;
                });
            });
    }).catch(function(err) {
        throw new Error(err.stack);
    }).done(function(count) {
        console.log('Processed %i items.'.format(count));
    });

})();
