/**
 * Created by jeanbluer on 26.01.15.
 */
var exec = require('child_process').exec;
var wsManager = require('./wsManager.js');
var playerManager = require('./playerManager.js');
var SequenceItem = require('./items/SequenceItem.js');
var OptionPoll = require('./polls/OptionPoll.js');
var NumberPoll = require('./polls/NumberPoll.js');
var mongoConnection = require('../mongoConnection.js');
var ObjectID = require('mongodb').ObjectID;
var gameConf = require('./gameConf');


function Game() {
    this.play = false;
    this.deckId = 0;
    this.stepId = 0;
    this.decks = [];
    this.conf = {};
    this.polls = [];
    this.sequence = null;
}

Game.prototype = {

    initDb: function () {
        var g = this;
        mongoConnection(function (db) {
            db.collection('gameconfs').find({role: 'run'}).toArray(function (err, conf) {
                g.conf = conf[0];
                if (conf.length == 0) g.conf = {
                    role: 'run',
                    startDeckId: 0,
                    autostart: false,
                    playerCnt: 1,
                    typeMapping: []
                };
                console.log("autostart=" + g.conf.autostart);
            });
        });
    },

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

                case "play":
                    console.log('play');
                    this.start();
                    break;

                case "stop":
                    this.stop();
                    break;

                case "go":
                    this.step(param);
                    break;

                case "rego":
                    console.log('rego');
                    this.step(param, this.stepId);
                    break;

                case "goto":
                    console.log('goto');
                    this.step(0, parseInt(param));
                    break;

                case "back":
                    console.log('back');
                    var id = this.stepId;
                    if (id > 0) id--;
                    this.step(param, id);
                    break;

                default:
                    console.log("game received unknown command: " + msg.type);
            }
        } catch (e) {
            console.log("ERROR in game.trigger! " + e.stack);
        }
    },

    directItem: function (clientId, msg) {
        this.mapItemToDevice(msg.data);
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
        return;
        var msg = "";
        //autostart or deny
        if (this.play == false) {
            if (this.conf.autostart) {
                this.start();
                return;
            }
            else msg += "we are not playing!";
            this.log(msg);
            return;
        }

        //step one up or to a specific step-nr
        this.stepId = (typeof id !== 'undefined') ? id : this.stepId += 1;
        console.log("stepId=" + this.stepId);
        //restart at step 0 when at the end
        if (this.stepId >= this.decks[this.deckId].items.length) {
            this.stepId = 0;
            msg += ": no more items - ";
        }

        var item = this.getItem();


        //objekt mit den relevanten daten zum senden vorbereiten
        var content;
        switch (item.type) {
            case "cmd":
                content = {
                    type: item.type,
                    command: item.text,
                    param: item.opts[0],
                    device: item.device
                };
                break;
            case "vote":
                this.polls.push(this.preparePoll(item));
                content = JSON.parse(JSON.stringify(item));   //=deep clone
                content.poll = this.polls[this.polls.length - 1];
                break;
            case "results":
                content = item;
                content.data = this.polls[this.polls.length - 1].getResult();
                console.log("item for result:");
                console.log(content);
                break;

            default:
                /*  hab ich aus irgendeinem grund mal einzeln übertragen...
                 content = {
                 type: item.type,
                 text: item.text,
                 voteOptions: JSON.parse(JSON.stringify(item.voteOptions)),   //=deep clone
                 opts: item.opts,
                 voteMulti: item.voteMulti,
                 flags: item.flags,
                 device: item.device
                 };
                 */
                content = JSON.parse(JSON.stringify(item));   //=deep clone
                break;
        }
        var wait = parseInt(this.getItem().wait) * 1000;
        if (typeof wait === 'undefinded') wait = 0;
        var self = this;
        setTimeout(function () {
            self.executeStep.call(self, content, param);
        }, wait);
    },

    preparePoll: function (item) {
        var poll;
        switch (item.opts[0]) {
            case "customOptions":
            case "customMultipleOptions":
                item.voteOptions.forEach(function (opt, id) {
                    opt.value = id;
                });
                poll = new OptionPoll(item);
                break;
            case "playerChoice":
            case "countryChoice":
                var lang = item.opts[2];
                item.voteOptions = this.getEUcountries().map(function (c) {
                    return {value: c.id, text: c[lang]}
                });
                poll = new OptionPoll(item);
                break;

            case "enterNumber":
                poll = new NumberPoll(item);
                break;
            default:
                break;
        }
        poll.onFinish(this, function () {
            this.trigger(-1, {data: 'go'})
        });
        return poll;
    },

    mapItemToDevice: function (item, param) {
        var self = this;
        if (item.type == "switch") {
            //ein switch hat die möglichen folgen in den voteOptions gespeichert...
            //und wählt nach param aus, welche folge er anfährt
            var option;
            for (var i = 0; i < item.voteOptions.length; i++) {
                option = item.voteOptions[i];
                if (option.text == param) {
                    self.decks.forEach(function (deck, id) {
                        if (String(deck._id) == String(option.followUp)) {
                            self.deckId = id;
                            self.log("switched to deck " + self.deckId);
                        }
                    });
                    self.step("", 0);
                    return;
                }
            }
            self.log("FollowUp nicht gefunden!!!");
        }
        else {
            //an die konfigurierten default-devices senden
            var map = {};
            if (item.device == "default" || typeof item.device == "undefined") map = this.conf.typeMapping.filter(function (tm) {
                return (tm.type == item.type);
            })[0];
            //oder an die speziell gewünschten devices senden
            else {
                map.devices = item.device.split(",");
            }
            if (map.devices.length == 0) this.log("keine Devices gefunden für " + item.type);
            map.devices.forEach(function (dev) {
                self.log("sending to " + dev + ": " + item.text);
                //statt device player wird der playerManager verwendet
                //es kann auch zB player:next geben...
                if (dev.indexOf("player") == 0) {
                    playerManager.addItem(item);
                    return;
                }
                //ist ein spezieller device-name angegeben? ZB für die buttons: button:red
                if (dev.indexOf(':') != -1) {
                    wsManager.msgDevicesByRoleAndName(dev.split(':')[0], dev.split(':')[1], "display", item);
                    return;
                }
                wsManager.msgDevicesByRole(dev, "display", item);
            });
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
                    if (String(deck._id) == String(g.conf.startDeckId)) g.deckId = id;
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
    loadDecks: function(callback) {

    },

    prepareSequence: function () {
        var deck = this.decks[this.deckId];
        this.sequence = null;
        for (var i = 0; i < deck.items.length; i++) {
            if (this.sequence == null) this.sequence = new SequenceItem(deck.items[i], i);
            else this.sequence.appendItem(new SequenceItem(deck.items[i], i));
        }
    },

    stop: function () {
        this.play = false;
        this.stepId = -1;
        this.log("stopped game");
        this.sendPlaybackStatus();
    },

    getItem: function () {
        if (this.stepId == -1) return null;
        return this.decks[this.deckId].items[this.stepId];
    },

    sendPlaybackStatus: function () {
        wsManager.msgDevicesByRole('master', 'playBackStatus', {
            stepId: this.stepId,
            type: this.getItem() ? this.getItem().type : ""
        });
    },
    getEUcountries: function () {
        return this.europeCountries.filter(function (c) {
            return c.class == "eu europe";
        });
    },

};

var gameObj = new Game();

module.exports = gameObj;
