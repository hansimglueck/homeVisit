var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Deck = require('../models/Deck.js');

/* GET /sequenceItems listing. */
router.get('/', function(req, res, next) {
  Deck.find(function (err, decks) {
    if (err) return next(err);
    res.json(decks);
  });
});

/* POST /sequenceItems */
router.post('/', function(req, res, next) {
  Deck.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* GET /sequenceItems/id */
router.get('/:id', function(req, res, next) {
  Deck.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* PUT /deck/:id */
router.put('/:id', function(req, res, next) {
  Deck.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) {
      console.log("autch: "+err);
      return next(err);
    }
    res.json(post);
  });
});

/* DELETE /sequenceItems/:id */
router.delete('/:id', function(req, res, next) {
  Deck.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;
