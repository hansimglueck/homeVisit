/**
 * Created by jeanbluer on 26.01.15.
 */
var exec = require('child_process').exec;
var wsManager = require('./wsManager.js');
var playerManager = require('./playerManager.js');
var SequenceItem = require('./items/SequenceItem.js');
var mongoConnection = require('../mongoConnection.js');
var gameConf = require('./gameConf');


function Game() {
    this.play = false;
    this.deckId = 0;
    this.stepId = 0;
    this.decks = [];
    this.conf = {};
    this.polls = [];
    this.sequence = null;
    this.alertState = 0;    //0: Alarmstufe off,  1: Alarmstufe an, 2: Alarmstufe blink
}

Game.prototype = {

    trigger: function (clientId, msg) {
        try {
            var param = "";
            if (typeof msg.param != "undefined") {
                param = msg.param;
            }
            console.log("game.trigger: " + msg.data + " with parameter: " + param);
            switch (msg.data) {
                case "restart":
                    this.start();
                    break;

                case "stop":
                    this.stop();
                    break;

                case "go":
                    this.alertState = 0;
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
    alert: function(clientId, msg) {
        this.alertState += 1;
        this.alertState %= 2;
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
                    self.sequence.step(param, id);
                });
            }
        }
    },
    start: function (callback) {
        //console.log(this.conf);
        var g = this;
        mongoConnection(function (db) {
            db.collection('decks').find({}).toArray(function (err, decks) {
                if (err) return next(err);
                g.decks = decks;
                g.decks.forEach(function (deck, id) {
                    if (String(deck._id) == String(gameConf.conf.startDeckId)) g.deckId = id;
                });
                g.prepareSequence();
                //g.sequence.step();
                //g.step("", 0);
                if (callback) callback();
            });
        });
        this.log("client started game");
        //wsManager.msgDevicesByRole('player', 'rates', {avgRating: this.avgRatings});
    },

    prepareSequence: function () {
        var deck = this.decks[this.deckId];
        this.sequence = null;
        for (var i = 0; i < deck.items.length; i++) {
            if (this.sequence == null) this.sequence = new SequenceItem(deck.items[i], i);
            else this.sequence.appendItem(new SequenceItem(deck.items[i], i));
        }
    },

    //TODO: anpassen
    stop: function () {
        this.play = false;
        this.stepId = -1;
        this.log("stopped game");
        this.sendPlaybackStatus();
    },
    sendPlaybackStatus: function () {
        wsManager.msgDevicesByRole('master', 'playBackStatus', {
            stepId: this.stepId,
            type: this.getItem() ? this.getItem().type : ""
        });
    }
 };

var gameObj = new Game();

module.exports = gameObj;
