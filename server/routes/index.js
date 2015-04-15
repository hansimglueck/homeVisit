var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res, next) {
  res.sendFile('playerApp/www/index.html', { root: __dirname + ""  });
});

router.get('/admin', function(req, res, next) {
  res.sendFile('../admin/index.html', { root: __dirname +"/../public"  });
});

router.get('/mc2', function(req, res, next) {
  res.sendFile('app/index.html', { root: __dirname +"/../../homeVisitMC"  });
});

router.get('/mc', function(req, res, next) {
  res.sendFile('mcApp/index.html', { root: __dirname +"/../public"  });
});

router.get('/game', function(req, res, next) {
  res.render('game', { title: 'HomeVisit' });
});

router.get('/master', function(req, res, next) {
  res.render('master', { title: 'HomeVisit Master' });
});

module.exports = router;
