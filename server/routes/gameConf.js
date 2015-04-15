var express = require('express');
var router = express.Router();
var mongoConnection = require('../mongoConnection');
var game = require('../../game/game.js');
var gameConf = require('../../game/gameConf.js');
var ObjectID = require('mongodb').ObjectID;

/* GET /gameConf listing. */

router.get('/', function (req, res, next) {
  mongoConnection(function (db) {
    db.collection('gameconfs').find({}).sort({_id: 1}).toArray(function (err, result) {
      if (err) return next(err);
      res.json(result);
    });
  });
});
router.get('/run', function(req, res, next) {
  mongoConnection(function (db) {
    db.collection('gameconfs').find({role:'run'}).toArray(function (err, result) {
      if (err) return next(err);
      res.json(result[0]);
    });
  });
});

/* POST /gameConf */
router.post('/', function (req, res, next) {
  mongoConnection(function (db) {
    db.collection('gameconfs').insertOne(req.body, function (err, result) {
      if (err) return next(err);
      res.json(result);
    });
  });
});

/* PUT /gameConf/:id */

router.put('/:id', function (req, res, next) {
  mongoConnection(function (db) {
    db.collection('gameconfs').updateOne({"_id": ObjectID(req.params.id)}, req.body, function (err, result) {
      if (err) return next(err);
      gameConf.syncFromDb();
      res.json(result);
    })
  });
});


module.exports = router;
