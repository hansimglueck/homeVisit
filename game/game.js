/**
 * Created by jeanbluer on 26.01.15.
 */
var exec = require('child_process').exec;

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

    trigger: function (sid, msg) {
        var param = "";
        if (msg.param) {
            param = msg.param;
        }
        console.log("game.trigger: " + sid + ", " + msg.data + "with parameter:" + param);
        switch (msg.data) {
            case "play":
                console.log('play');
                this.start(sid);
                break;

            case "stop":
                this.stop(sid);
                break;

            case "go":
                console.log('go');
                this.step(sid, param);
                break;

            case "rego":
                console.log('rego');
                this.step(sid, param, this.stepId);
                break;

            case "back":
                console.log('back');
                var id = this.stepId;
                if (id > 0) id--;
                this.step(sid, param, id);
                break;

            default:
                this.log("game received unknown command: " + msg);
        }
    },

    log: function (sid, message) {
        message = "Client " + sid + " - " + message;
        this.clients.forEach(function each(client) {
            if (client.role == "master" && client.connected) client.socket.send(JSON.stringify({
                type: "log",
                data: message
            }));
        });
        console.log("gesendet");
    },

    step: function (sid, param, id) {
        var msg = "";

        //autostart or deny
        if (this.play == false) {
            if (this.conf.autostart) {
                this.start(sid);
                return;
            }
            else msg += "we are not playing!";
            this.log(sid, msg);
            return;
        }

        //step one up or to a specific step-nr
        this.stepId = (typeof id !== 'undefined') ? id : this.stepId += 1;

        //restart at step 0 when at the end
        if (this.stepId >= this.decks[this.deckId].items.length) {
            this.stepId = 0;
            msg += ": no more items - ";
        }

        //objekt mit den relevanten daten zum senden vorbereiten
        var content = {
            type: this.getItem().type,
            text: this.getItem().text,
            voteOptions: this.getItem().voteOptions,
            voteMulti: this.getItem().voteMulti
        };

        //die eingehenden votes werden in einem objekt des aktuellen items gespeichert
        if (content.type == "vote") this.getItem().votes = {};

        //log-nachricht
        msg += " stepped to " + this.stepId + " (" + content.type + ")";
        this.log(sid, msg, content);

        var wait = parseInt(this.getItem().wait) * 1000;
        if (typeof wait === 'undefinded') wait = 0;
        var self = this;
        setTimeout(function () {
            self.executeStep.call(self, sid, content, param);
        }, wait);
    },

    executeStep: function (sid, content, param) {
        var self = this;
        if (content.type == "switch") {
            content.voteOptions.forEach(function (option) {
                if (option.text == param) {
                    self.decks.forEach(function (deck, id) {
                        console.log(deck._id);
                        console.log(option.followUp);
                        if (String(deck._id) == String(option.followUp)) self.deckId = id;
                        console.log(String(deck._id) == String(option.followUp));
                    });
                    //console.log(g.decks);
                    self.step(sid, "", 0);
                    return;
                }
                self.log(sid, "FollowUp nicht gefunden!!!")
            });
        } else {
            //an die konfigurierten default-devices senden
            var map = this.conf.typeMapping.filter(function (tm) {
                return (tm.type == content.type);
            })[0];
            if (map.devices.length == 0) this.log(sid, "keine Devices gefunden für " + content.type);
            map.devices.forEach(function (dev) {
                self.msgDevicesByRole(dev, "display", content);
            });
            self.msgDevicesByRole('master', 'status', {stepId: self.stepId, type: self.getItem().type});

        }
        //checken, wie der nächste step getriggert wird
        if (this.stepId + 1 < this.decks[this.deckId].items.length) {
            if (this.decks[this.deckId].items[this.stepId + 1].trigger == "follow") {
                this.step(sid);
            }
        }
    },

    start: function (sid) {
        console.log(this.conf);
        if (this.play == false) {
            var g = this;
            var Deck = require('../models/Deck.js');
            for (var i = 0; i < this.conf.playerCnt; i++) {
                this.rating[i] = [];
                for (var j = 0; j < this.conf.playerCnt; j++) {
                    this.rating[i][j] = 4;
                }
            }
            this.calcAvgRate();

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
                g.step(sid, "", 0);
            });
            this.play = true;
            this.log(sid, "client" + sid + " started game");
            this.msgDevicesByRole('player', 'rates', {avgRating: this.avgRating});
        } else {
            this.log(sid, "client" + sid + " already playing");
        }
    },

    stop: function (sid) {
        this.play = false;
        //this.players = {};
        this.stepId = 0;
        this.log(sid, "client" + sid + " stopped game");
    },

    vote: function (sid, data) {
        var pid = data.playerId;
        data = data.data;
        if (this.decks[this.deckId].items[this.stepId].type != "vote") {
            this.msgDeviceByIds([sid], "display", {"text": "There is no vote at the moment!"});
            return;
        }
        if (this.getItem().votes[sid]) {
            this.msgDeviceByIds([sid], "display", {"text": "You already voted in this Poll!"});
        }
        console.log("vote=" + data);
        var msg = "You voted: ";
        for (var i = 0; i < data.length; i++) {
            if (data[i].checked) msg += data[i].text + " ";
            this.getItem().votes[sid] = data;
            this.getItem().votes[sid].multiplier = this.avgRating[pid];
        }
        this.log(sid, msg);
        this.msgDeviceByIds([sid], "display", {"text": msg});
        if (Object.keys(this.getItem().votes).length >= this.conf.playerCnt) this.voteComplete();
    },

    voteComplete: function () {
        var votes = this.getItem().votes;
        var voteOptions = this.getItem().voteOptions;
        var voteCount = 0;
        var bestOption = 0;
        Object.keys(votes).forEach(function (v) {
            for (var i = 0; i < voteOptions.length; i++) {
                if (!voteOptions[i].result) voteOptions[i].result = 0;
                if (!voteOptions[i].votes) voteOptions[i].votes = 0;
                if (votes[v][i].checked) {
                    voteCount += votes[v].multiplier;
                    voteOptions[i].result += votes[v].multiplier;
                    voteOptions[i].votes += 1;
                    if (voteOptions[i].result > voteOptions[bestOption].result) bestOption = i;
                }
            }
        });
        voteOptions.sort(function (a, b) {
            return b.result - a.result
        });
        var msg = this.getItem().text;
        var labels = [];
        var resData = [];
        this.getItem().voteOptions.forEach(function (option) {
            //msg += option.text + ": " + (option.result / voteCount * 100).toFixed(1) + "% (" + option.result + "/" + voteCount + ")" + "::";
            labels.push(option.text + ": " + (option.result / voteCount * 100).toFixed(1) + "% (" + option.votes + ")");
            resData.push(option.result / voteCount * 100);
        });
        this.msgDevicesByRole('player', "display", {type: "result", text: msg, labels: labels, data: resData});
    },

    getItem: function () {
        return this.decks[this.deckId].items[this.stepId];
    }

};

var gameObj = new Game();

module.exports = gameObj;