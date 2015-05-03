(function() {
    'use strict';

    var express = require('express');
    var router = express.Router();
    var mongoConnection = require('../../homevisit_components/mongo/mongoConnection.js');
    var ObjectID = require('mongodb').ObjectID;
    var Q = require('q');
    var _ = require('underscore');

    // get items for deck
    function getItems(db, itemIds) {
        var find = db.collection('items').find({ _id: { $in: itemIds } });
        var toArray = Q.nbind(find.toArray, find)().then(function(itemsResults) {
            // order properly
            var items = [];
            itemIds.forEach(function(id) {
                items.push(_.find(itemsResults, function(item) { return String(item._id) === String(id); }));
            });
            return items;
        });
        return toArray;
    }

    /* GET /decks listing. */
    // item references get replaced with items
    router.get('/', function (req, res, next) {
        mongoConnection(function (db) {
            var sorted = db.collection('decks').find({}).sort({ _id: 1 });
            var toArray = Q.nbind(sorted.toArray, sorted);

            toArray().then(function(decks) {
                var promises = [];
                decks.forEach(function(deck) {
                    promises.push(getItems(db, deck.items).then(function(items) {
                        deck.items = items;
                    }));
                });
                return Q.all(promises).then(function() {
                    res.json(decks);
                });
            }).catch(function(err) {
                console.log('ERROR:', err);
            }).done();
        });
    });

    /* POST /decks */
    // items are updated and deck.items is filled with item references before updating
    // TODO: I think this is broken! Test using JSON Import
    router.post('/', function (req, res, next) {
        mongoConnection(function (db) {
            var deck = req.body, items = db.collection('items'),
                decks = db.collection('decks');
            var itemPromises = [], itemHashes = [];
            deck.items.forEach(function(item) {
                if (typeof item._id === 'undefined') {
                    item._id = new ObjectID();
                }
                itemHashes.push(item._id);
                var updateItem = Q.nbind(items.update, items);
                itemPromises.push(updateItem({ _id: item._id }, item, { upsert: true }));
            });
            Q.all(itemPromises).then(function() {
                deck.items = itemHashes;
                var insertOne = Q.nbind(decks.insertOne, decks);
                return insertOne(deck);
            }).then(function(result) {
                res.json(result.ops[0]);
            }).catch(function(err) {
                console.log('ERROR:', err);
            }).done();
        });
    });

    /* GET /decks/id */
    // item references get replaced with items
    router.get('/:id', function (req, res, next) {
        mongoConnection(function (db) {
            var find = db.collection('decks').find({ _id: new ObjectID(req.params.id) });
            var toArray = Q.nbind(find.toArray, find);
            toArray().then(function(decks) {
                var deck = decks[0];
                return getItems(db, deck.items).then(function(items) {
                    deck.items = items;
                    res.json(deck);
                });
            }).catch(function(err) {
                console.log('ERROR:', err);
            }).done();
        });
    });

    /* PUT /deck/:id */
    // items are updated and deck.items is filled with item references before updating
    router.put('/:id', function (req, res, next) {
        mongoConnection(function (db) {
            var deck = req.body, items = db.collection('items'), decks = db.collection('decks');
            var itemPromises = [], itemHashes = [];
            deck.items.forEach(function(item) {
                if (typeof item._id === 'undefined') {
                    item._id = new ObjectID();
                }
                itemHashes.push(item._id);
                var updateItem = Q.nbind(items.update, items);
                itemPromises.push(updateItem({ _id: item._id }, item, { upsert: true }));
            });
            Q.all(itemPromises).then(function() {
                deck.items = itemHashes;
                var updateOne = Q.nbind(decks.updateOne, decks);
                return updateOne({ _id: new ObjectID(req.params.id) }, deck);
            }).then(function(result) {
                res.json(result);
            }).catch(function(err) {
                console.log('ERROR:', err);
            }).done();
        });
    });

    /* DELETE /decks/:id */
    router.delete('/:id', function (req, res, next) {
        mongoConnection(function (db) {
            db.collection('decks').deleteOne({ _id: new ObjectID(req.params.id)}, function (err, result) {
                if (err) {
                    return next(err);
                }
                res.json(result);
            });
        });
    });

    module.exports = router;

})();
