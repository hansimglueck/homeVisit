#!/usr/bin/env node

(function() {
    'use strict';

    var express = require('express');
    var path = require('path');
    //var logger = require('morgan');
    var cookieParser = require('cookie-parser');
    var bodyParser = require('body-parser');

    var mongoConnection = require('../homevisit_components/mongo/mongoConnection.js');
    var playerManager = require('../game/playerManager.js');
    var gameRecordings = require('../game/gameRecording.js');
    var raspiTools = require('../game/raspiTools.js');

    var log4js = require('log4js');
    var logger = log4js.getLogger('server');
    logger.setLevel('INFO');

    var serverLogger = log4js.getLogger('httpServer');
    serverLogger.setLevel('ERROR');

    var conf = require('../homevisitConf');
    var app = express();

    var importSessions = require('../homevisit_components/mongo/importSessionsModule.js');
    var exec = require('child_process').exec;

    var gameConf = require('../game/gameConf.js');

    // HTTP server
    var server = require('http').createServer(app);

    if (!conf.masterMind) {
        // websocket
        var WebSocketServer = require('ws').Server;
        var wss = new WebSocketServer({server: server});
        var wsManager = require('../game/wsManager.js');
        wsManager.setSocketServer(wss);

        wsManager.onRole("player", playerManager, playerManager.playerMessage);
        wsManager.onType("register", playerManager, playerManager.requestStatus);
        wsManager.onType("score", playerManager, playerManager.scoreMessage);
        wsManager.onType("setPlayerStatus", playerManager, playerManager.setStatusMessage);

        var game = require('../game/game.js');
        wsManager.onType("playbackAction", game, game.trigger);
        wsManager.onType("alert", game, game.alert);
        wsManager.onType("register", game, game.sendPlayBackStatus);
        wsManager.onType("pollResults", game, game.pollResults);
        wsManager.onType("uploadRecording", game, game.uploadRecording);
        wsManager.onType("vote", game, game.vote);

        raspiTools.startOnlineObservation(1000);
        wsManager.onType("os", raspiTools, raspiTools.newMessage);
        wsManager.onType("database", raspiTools, raspiTools.newMessage);
        raspiTools.addOnlineTask(raspiTools, raspiTools.importSessions, 666000);
        raspiTools.addOnlineTask(raspiTools, raspiTools.exportRecordingsToDizzi, 622000);

        var setupMonitoring = require('../game/setupMonitoring.js');
        setupMonitoring.startSetupMonitoring();

        wsManager.onType("getGameConf", gameConf, gameConf.confRequest);
        wsManager.onType('getGameSessions', gameConf, gameConf.gameSessionsRequest);
        wsManager.onType('setGameSession', gameConf, gameConf.setGameSession);
        wsManager.onType('getLanguage', gameConf, gameConf.languageRequest);
        wsManager.onType('changeLanguage', gameConf, gameConf.changeLanguage);
    } else {
        raspiTools.startOnlineObservation(1000);
        raspiTools.addOnlineTask(gameRecordings, gameRecordings.uploadAllNew,600000);
    }

    // load game conf
    mongoConnection(function (db) {
        logger.info("Database connection established");
        gameConf.syncFromDb();
    });

    // app views
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');

    // middlewares
//    app.use(logger('dev'));
    app.use(log4js.connectLogger(serverLogger, { level: 'auto', nolog: 'favicon.ico'}));
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
    app.use(cookieParser());

    // static routes
    app.use('/bower_components', express.static(path.join(__dirname, '/../bower_components')));
    app.use('/homevisit_components', express.static(path.join(__dirname, '/../homevisit_components')));
    app.use('/admin', express.static(path.join(__dirname, '/../admin')));
    if (!conf.masterMind) {
        app.use('/player', express.static(path.join(__dirname, '/../player')));
        app.use('/mc', express.static(path.join(__dirname, '/../mc')));
        app.use('/slideshow', express.static(path.join(__dirname, '/../slideshow')));
    }

    // resource routes
    app.use('/decks', require('./routes/decks'));
    app.use('/gameConf', require('./routes/gameConf'));
    app.use('/recordings', require('./routes/recordings'));
    if (conf.masterMind) {
        app.use('/nodes', require('./routes/nodes'));
    }

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
    server.listen(conf.port, conf.bindAddress, function () {
        logger.info('Listening on ' + conf.bindAddress + ':' + conf.port);
    });

})();
