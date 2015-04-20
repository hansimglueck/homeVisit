/**
 * Created by jeanbluer on 26.01.15.
 */
var exec = require('child_process').exec;
var wsManager = require('./wsManager.js');
var playerManager = require('./playerManager.js');
var SequenceItem = require('./items/SequenceItem.js');
var mongoConnection = require('../server/mongoConnection.js');
var gameConf = require('./gameConf');
var _ = require('underscore');
var Q = require('q');


function Game() {
    this.play = false;
    this.deckId = 0;
    this.stepIndex = 0;
    this.decks = [];
    this.conf = {};
    this.polls = [];
    this.sequence = null;
    this.alertState = 0;    //0: Alarmstufe off,  1: Alarmstufe an, 2: Alarmstufe blink
}

Game.prototype = {

    //callback für type="playBackAction"-Messages
    trigger: function (clientId, role, msg) {
        try {
            //für scripte, die noch im format {type:"playBackAction", data:"go", param:0} senden::
            if (typeof msg.data.cmd === "undefined") {
                msg.data = {cmd: msg.data, param: msg.param};
            }

            var param = "";
            if (typeof msg.data.param != "undefined") {
                param = msg.data.param;
            }

           console.log("game.trigger: " + msg.data.cmd + " with parameter: " + param);
            switch (msg.data.cmd) {
                //TODO: das ist hier nicht korrekt. sollte als type="score" emitted werden. und wird dann entsprechend im playerManager empfangen ->.mcMessage()
                    //evtl. ist die struktur aber auch käse ;)
                case "rate":
                    playerManager.players[param.playerId].score = playerManager.players[param.playerId].score + param.value;
                    playerManager.sendPlayerStatus(param.playerId);
                    break;

                case "restart":
                    this.start();
                    break;

                case "stop":
                    this.stop();
                    break;

                case "go":
                    if (this.alertState != 0) {
                        this.alertState = 2;
                        this.alert();
                    }
                    this.step(param);
                    break;

                case "rego":
                    console.log('rego');
                    if (this.sequence !== null) this.sequence.restep();
                    break;

                case "goto":
                    console.log('goto');
                    if (this.sequence !== null) this.sequence.stepToId(0, parseInt(param));
                    break;

                case "back":
                    console.log('back');
                    if (this.sequence !== null) this.sequence.back(param);
                    break;

                default:
                    console.log("game received unknown command: " + msg.type);
            }
        } catch (e) {
            console.log("ERROR in game.trigger! " + e.stack);
        }
    },
    alert: function(clientId, role, msg) {
        this.alertState += 1;
        this.alertState %= 3;
        var self = this;
        var recipients = gameConf.getOption("alertRecipients").split(",");
        recipients.forEach(function(recipient){
            var role = recipient.split(":")[0];
            var name = recipient.split(":")[1];
            if (role != "player") wsManager.msgDevicesByRoleAndName(role, name, "display", {type:"alert", param:self.alertState});
            else playerManager.deliverMessage(recipient, "display", {type:"alert", param:self.alertState});
        })
    },

    log: function (message) {
        message = "GAME: " + message;
        wsManager.msgDevicesByRole("master", "log", message);
    },

    step: function (param, id) {
        var self = this;
        if (this.sequence == null) this.start(function () {
            self.sequence.step(param, id);
        });
        else {
            if (!this.sequence.step(param, id)) {
                this.start(function () {
                    self.sequence.reset();
                    self.sequence.step(param, id);
                });
            }
        }
    },
    start: function (callback) {
        //console.log(this.conf);
        if (this.sequence !== null) this.sequence.finish();
        var g = this;
        mongoConnection(function (db) {
            db.collection('decks').find({}).toArray(function (err, decks) {
                if (err) return next(err);
                g.decks = decks;
                g.decks.forEach(function (deck, id) {
                    if (String(deck._id) == String(gameConf.conf.startDeckId)) g.deckId = id;
                });
                g.prepareSequence(db, function(sequence) {
                    //sequence.step();
                    //g.step("", 0);
                    sequence.sendPlaybackStatus();
                    if (callback) callback();
                });
            });
        });
        this.log("client started game");
        //wsManager.msgDevicesByRole('player', 'rates', {avgRating: this.avgRatings});
    },

    prepareSequence: function(db, cb) {
        var deck = this.decks[this.deckId];

        // load items from db
        var promises = [];
        deck.items.forEach(function(item, i) {
            promises.push(new SequenceItem(db, deck.items[i], i));
        });

        var self = this;
        this.sequence = null;

        return Q.allSettled(promises).then(function(results) {
            // unpack & respect order
            var items = _.sortBy(_.pluck(results, 'value'), 'index');
            items.forEach(function(item, i) {
                if (self.sequence === null) {
                    self.sequence = items[i];
                }
                else {
                    self.sequence.appendItem(items[i]);
                }
            });
            cb(self.sequence);
        }).catch(function(err) {
            console.log('Error loading items:', err);
            throw new Error(err);
        }).done();
    },

    sendPlayBackStatus: function(clientId, role, msg) {
        if (role !== "MC" && role !== "master") return;
        if (this.sequence !== null) this.sequence.sendPlaybackStatus();
    }
 };

var gameObj = new Game();

module.exports = gameObj;
