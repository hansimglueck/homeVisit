var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res, next) {
  if (req.session.userName) {
    res.render('player', { title: 'HomeVisit Player', sess: req.session.userName });
  } else {
    res.render('player', { title: 'HomeVisit Player', sess: "anon" });
  }
});

router.get('/admin', function(req, res, next) {
  res.render('admin', { title: 'HomeVisit Admin' });
});

router.get('/game', function(req, res, next) {
  res.render('game', { title: 'HomeVisit' });
});

router.get('/master', function(req, res, next) {
  res.render('master', { title: 'HomeVisit Master' });
});
router.get('/test', function(req, res, next) {
  res.render('test', { title: 'TEST' });
});




module.exports = router;
