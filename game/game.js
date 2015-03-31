/**
 * Created by jeanbluer on 26.01.15.
 */
var exec = require('child_process').exec;
var wsManager = require('./wsManager.js');
var playerManager = require('./playerManager.js');


function Game() {
    this.play = false;
    this.deckId = 0;
    this.stepId = 0;
    this.decks = [];
    this.conf = {};
}

Game.prototype = {

    initDb: function () {
        var g = this;
        var gConf = require('../models/GameConf.js');
        gConf.findOne({role: 'run'}, function (err, conf) {
            g.conf = conf;
            if (conf == null) g.conf = {role: 'run', startDeckId: 0, autostart: false, playerCnt: 1, typeMapping: []};
            console.log("autostart=" + g.conf.autostart);
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
                case "play":
                    console.log('play');
                    this.start();
                    break;

                case "stop":
                    this.stop();
                    break;

                case "go":
                    console.log('go');
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

    directItem: function(clientId, msg) {
        this.mapItemToDevice(msg.data);
    },

    log: function (message) {
        message = "GAME: " + message;
        wsManager.msgDevicesByRole("master", "log", message);
    },

    step: function (param, id) {
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
        console.log("stepId="+this.stepId);
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
        //log-nachricht
        msg += " stepping to " + this.deckId + "/" + this.stepId + " (" + content.type + ")";
        this.log(msg);

        var wait = parseInt(this.getItem().wait) * 1000;
        if (typeof wait === 'undefinded') wait = 0;
        var self = this;
        setTimeout(function () {
            self.executeStep.call(self, content, param);
        }, wait);
    },

    executeStep: function (content, param) {
        this.mapItemToDevice(content,param);

        //der master soll mitkriegen, welcher step gerade ausgeführt wird
        this.sendPlaybackStatus();

        //checken, wie der nächste step getriggert wird
        if (this.stepId + 1 < this.decks[this.deckId].items.length) {
            if (this.decks[this.deckId].items[this.stepId + 1].trigger == "follow") {
                this.step();
            }
        }
    },

    mapItemToDevice: function(content, param) {
        var self = this;
        if (content.type == "switch") {
            //ein switch hat die möglichen folgen in den voteOptions gespeichert...
            //und wählt nach param aus, welche folge er anfährt
            var option;
            for (var i = 0; i < content.voteOptions.length; i++) {
                option = content.voteOptions[i];
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
            if (content.device == "default" || typeof content.device == "undefined") map = this.conf.typeMapping.filter(function (tm) {
                return (tm.type == content.type);
            })[0];
            //oder an die speziell gewünschten devices senden
            else {
                map.devices = content.device.split(",");
            }
            if (map.devices.length == 0) this.log("keine Devices gefunden für " + content.type);
            map.devices.forEach(function (dev) {
                self.log("sending to " + dev + ": " + content.text);
                //statt device player wird der playerManager verwendet
                if (dev == "player") {
                    playerManager.addItem(content);
                    //TODO: nach player-step ist ja garkein follow möglich :.(
                    return;
                }
                //ist ein spezieller device-name angegeben? ZB für die buttons: button:red
                if (dev.indexOf(':') != -1) {
                    wsManager.msgDevicesByRoleAndName(dev.split(':')[0], dev.split(':')[1], "display", content);
                    return;
                }
                wsManager.msgDevicesByRole(dev, "display", content);
            });
        }

    },

    start: function () {
        console.log(this.conf);
        if (this.play == false) {
            var g = this;
            var Deck = require('../models/Deck.js');

            Deck.find(function (err, decks) {
                if (err) return next(err);
                g.decks = decks;
                g.decks.forEach(function (deck, id) {
                    console.log(deck._id);
                    console.log(g.conf.startDeckId);
                    if (String(deck._id) == String(g.conf.startDeckId)) g.deckId = id;
                    console.log(String(deck._id) == String(g.conf.startDeckId));
                });
                //console.log(g.decks);
                g.step("", 0);
            });
            this.play = true;
            this.log("client started game");
            //wsManager.msgDevicesByRole('player', 'rates', {avgRating: this.avgRatings});
        } else {
            this.log("already playing");
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

    sendPlaybackStatus: function() {
        wsManager.msgDevicesByRole('master', 'playBackStatus', {stepId: this.stepId, type: this.getItem() ? this.getItem().type : ""});
    }

};

var gameObj = new Game();

module.exports = gameObj;
