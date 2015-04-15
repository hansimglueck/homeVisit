#!/usr/bin/env node

// default settings laden
var conf = require('../homevisitConf');
// lokale settings laden
try {
    conf = require('../homevisitConf.local');
    console.log('Verwende lokale Konfiguration homevisitConf.local');
} catch (err) {}

var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var mongoConnection = require('./mongoConnection');
var playerManager = require('../game/playerManager.js');

var app = express();

// HTTP server
var server = require('http').createServer(app);

// websocket
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({server: server});
var wsManager = require('../game/wsManager.js');
wsManager.setSocketServer(wss);

wsManager.onRole("player", playerManager, playerManager.playerMessage);
wsManager.onRole("master", playerManager, playerManager.masterMessage);
wsManager.onRole("MC", playerManager, playerManager.mcMessage);

var game = require('../game/game.js');
wsManager.onType("playbackAction", game, game.trigger);
wsManager.onType("alert", game, game.alert);
wsManager.onType("directItem", game, game.directItem);

var raspiTools = require('../game/raspiTools.js');
wsManager.onRole("master", raspiTools, raspiTools.newMessage);

var gameConf = require('../game/gameConf.js');

mongoConnection(function (db) {
    console.log("Database connection established");
    gameConf.syncFromDb();
});

// app views
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// middlewares
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: '1234',
    resave: false,
    saveUninitialized: true,
    cookie: { httpOnly: false }    //damit angular drauf zugreifen kann
}));

app.use(function (req, res, next) {
    var pid = req.session.pid;
    //wsManager.registerSID(req.sessionID);
    next();
});

// static routes
app.use('/bower_components', express.static(path.join(__dirname, '/../bower_components')));
app.use('/admin', express.static(path.join(__dirname, '/../admin')));
app.use('/player', express.static(path.join(__dirname, '/../player')));
app.use('/mc', express.static(path.join(__dirname, '/../mc')));

// resource routes
app.use('/decks', require('./routes/decks'));
app.use('/gameConf', require('./routes/gameConf'));

// app routes
app.use('/', require('./routes/main'));

// error handling

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// tschacka!
server.listen(conf.port);
