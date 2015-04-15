var express = require('express');
var router = express.Router();
var mongoConnection = require('../mongoConnection');
var ObjectID = require('mongodb').ObjectID;

/* GET /sequenceItems listing. */
router.get('/', function (req, res, next) {
    mongoConnection(function (db) {
        db.collection('decks').find({}).sort({_id: 1}).toArray(function (err, decks) {
            if (err) return next(err);
            res.json(decks);
        });
    });
});

/* POST /sequenceItems */
router.post('/', function (req, res, next) {
    console.log(req.body);
    mongoConnection(function (db) {
        db.collection('decks').insertOne(req.body, function (err, result) {
            console.log(result.ops);
            if (err) return next(err);
            res.json(result.ops[0]);
         });
    });
});

/* GET /sequenceItems/id */
router.get('/:id', function (req, res, next) {
    mongoConnection(function (db) {
        db.collection('decks').find({"_id": ObjectID(req.params.id)}).toArray(function (err, decks) {
            if (err) return next(err);
            res.json(decks[0]);
        });
    });

});

/* PUT /deck/:id */
router.put('/:id', function (req, res, next) {
    mongoConnection(function (db) {
        db.collection('decks').updateOne({"_id": ObjectID(req.params.id)}, req.body, function (err, result) {
            if (err) return next(err);
            res.json(result);
        })
    });
});

/* DELETE /sequenceItems/:id */
router.delete('/:id', function (req, res, next) {
    mongoConnection(function (db) {
        db.collection('decks').deleteOne({"_id": ObjectID(req.params.id)}, function (err, result) {
            if (err) return next(err);
            res.json(result);
        });
    });
});

module.exports = router;
