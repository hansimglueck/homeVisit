var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var gameConf = require('../models/gameConf.js');
var game = require('../game/game.js');

/* GET /gameConf listing. */
router.get('/', function(req, res, next) {
  gameConf.find(function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

router.get('/run', function(req, res, next) {
  gameConf.findOne({role:'run'}, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* POST /gameConf */
router.post('/', function(req, res, next) {
  gameConf.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* GET /gameConf/id */
router.get('/:id', function(req, res, next) {
  gameConf.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* PUT /gameConf/:id */
router.put('/:id', function(req, res, next) {
  gameConf.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) {
      console.log("autch: "+err);
      return next(err);
    }
    game.initDb();
    res.json(post);
  });
});

/* DELETE /gameConf/:id */
router.delete('/:id', function(req, res, next) {
  gameConf.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;
