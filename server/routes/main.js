var router = require('express').Router();

router.get('/', function(req, res, next) {
    res.redirect('/player');
});

router.get('/admin', function(req, res, next) {
  res.sendFile('index.html', { root: __dirname + '/../../admin' });
});

router.get('/player', function(req, res, next) {
  res.sendFile('index.html', { root: __dirname + '/../../player' });
});

router.get('/mc', function(req, res, next) {
    res.sendFile('mc/index.html', { root: __dirname +"/../public"  });
});

router.get('/emulator', function(req, res, next) {
    res.render('emulator');
});

module.exports = router;
