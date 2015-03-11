var conf = require('./homevisitConf');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var exec = require('child_process').exec;

mongoose.connect('mongodb://localhost/homeVisit', function(err) {
    if(err) {
        console.log('db-connection error', err);
    } else {
        db.on('close', function () {
            console.log('Error...close');
        });
        db.on('error', function() {
            console.log("ERROR error");
        })
        console.log('db-connection successful');
     }
});

var routes = require('./routes/index');
var decks = require('./routes/decks');
var gameConfs = require('./routes/gameConf');

var app = express();

/**
 * Create HTTP server.
 */

var server = require('http').createServer(app);
//var server2 = require('http').createServer(app);
//
//var io = require('socket.io')(server2);
//io.on('connection', function (socket) {
//    socket.emit('news', { hello: 'world' });
//    socket.on('my other event', function (data) {
//        console.log(data);
//    });
//});
/**
 */

/**
 * ///////////////////////////////////////////////////
 * create game
 */

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({server: server});
var wsManager = require('./game/wsManager.js');
wsManager.setSocketServer(wss);

var playerManager = require('./game/playerManager.js');
wsManager.onRole("player", playerManager, playerManager.playerMessage);
wsManager.onRole("master", playerManager, playerManager.masterMessage);

var game = require('./game/game.js');
wsManager.onRole("master", game, game.trigger);
wsManager.onRole("button", game, game.trigger);

var raspiTools = require('./game/raspiTools.js');
wsManager.onRole("master", raspiTools, raspiTools.newMessage);

var db = mongoose.connection;
db.once('open', function() { game.initDb() });


/**
 * /////////////////////////////////////////////
 */

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
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

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/playerApp/www')));
app.use('/decks', decks);
app.use('/gameConf', gameConfs);
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Foundd');
    err.status = 404;
    next(err);
});

// error handlers

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

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(conf.port);
//server2.listen(3001);
//server.on('error', onError);
//server.on('listening', onListening);

//module.exports = app;
