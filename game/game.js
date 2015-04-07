/**
 * Created by jeanbluer on 26.01.15.
 */
var exec = require('child_process').exec;
var wsManager = require('./wsManager.js');
var playerManager = require('./playerManager.js');
var SequenceItem = require('./items/SequenceItem');
var OptionPoll = require('./polls/OptionPoll');
var NumberPoll = require('./polls/NumberPoll');
var mongoConnection = require('../mongoConnection');
var ObjectID = require('mongodb').ObjectID;


function Game() {
    this.play = false;
    this.deckId = 0;
    this.stepId = 0;
    this.decks = [];
    this.conf = {};
    this.europeCountries = [{"id": "pt", en: "Portugal", de: "Portugal", "class": "eu europe"}, {
        "id": "es",
        en: "Spain",
        de: "Spanien",
        "class": "eu europe"
    }, {"id": "be", en: "Belgium", de: "Belgien", "class": "eu europe"}, {
        "id": "it",
        en: "Italy",
        de: "Italien",
        "class": "eu europe"
    }, {"id": "pl", en: "Poland", de: "Polen", "class": "eu europe"}, {
        "id": "fi",
        en: "Finlandia",
        de: "Finnland",
        "class": "eu europe"
    }, {"id": "de", en: "Germany", de: "Deutschland", "class": "eu europe"}, {
        "id": "se",
        en: "Sweden",
        de: "Schweden",
        "class": "eu europe"
    }, {"id": "cy", en: "Cyprus", de: "Zypern", "class": "eu europe"}, {
        "id": "ie",
        en: "Ireland",
        de: "Irland",
        "class": "eu europe"
    }, {"id": "uk", en: "United Kingdom", de: "Vereinigtes Königreich", "class": "eu europe"}, {
        "id": "at",
        en: "Austria",
        de: "Österreich",
        "class": "eu europe"
    }, {"id": "cz", en: "Czech Republic", de: "Tschechien", "class": "eu europe"}, {
        "id": "sk",
        en: "Slovakia",
        de: "Slowakei",
        "class": "eu europe"
    }, {"id": "hu", en: "Hungary", de: "Ungarn", "class": "eu europe"}, {
        "id": "lt",
        en: "Lithuania",
        de: "Litauen",
        "class": "eu europe"
    }, {"id": "lv", en: "Latvia", de: "Lettland", "class": "eu europe"}, {
        "id": "ro",
        en: "Romania",
        de: "Rumänien",
        "class": "eu europe"
    }, {"id": "bg", en: "Bulgaria", de: "Bulgarien", "class": "eu europe"}, {
        "id": "ee",
        en: "Estonia",
        de: "Estland",
        "class": "eu europe"
    }, {"id": "lu", en: "Luxembourg", de: "Luxemburg", "class": "eu europe"}, {
        "id": "fr",
        en: "France",
        de: "Frankreich",
        "class": "eu europe"
    }, {"id": "nl", en: "Netherlands", de: "Niederlande", "class": "eu europe"}, {
        "id": "si",
        en: "Slovenia",
        de: "Slowenien",
        "class": "eu europe"
    }, {"id": "dk", en: "Denmark", de: "Dänemark", "class": "eu europe"}, {
        "id": "mt",
        en: "Malta",
        de: "Malta",
        "class": "eu europe"
    }, {"id": "hr", en: "Croatia", de: "Kroatien", "class": "eu europe"}, {
        "id": "gr",
        en: "Greece",
        de: "Griechenland",
        "class": "eu europe"
    }, {"id": "im", en: "", de: "", "class": "europe"}, {"id": "is", en: "", de: "", "class": "europe"}, {
        "id": "by",
        en: "",
        de: "",
        "class": "europe"
    }, {"id": "no", en: "", de: "", "class": "europe"}, {"id": "ua", en: "", de: "", "class": "europe"}, {
        "id": "tr",
        en: "",
        de: "",
        "class": "europe"
    }, {"id": "ch", en: "", de: "", "class": "europe"}, {"id": "md", en: "", de: "", "class": "europe"}, {
        "id": "al",
        en: "",
        de: "",
        "class": "europe"
    }, {"id": "ad", en: "", de: "", "class": "europe"}, {"id": "sm", en: "", de: "", "class": "europe"}, {
        "id": "mc",
        en: "",
        de: "",
        "class": "europe"
    }, {"id": "li", en: "", de: "", "class": "europe"}, {"id": "ba", en: "", de: "", "class": "europe"}, {
        "id": "mk",
        en: "",
        de: "",
        "class": "europe"
    }, {"id": "va", en: "", de: "", "class": "europe"}, {"id": "gl", en: "", de: "", "class": null}, {
        "id": "ma",
        en: "",
        de: "",
        "class": null
    }, {"id": "tn", en: "", de: "", "class": null}, {"id": "dz", en: "", de: "", "class": null}, {
        "id": "jo",
        en: "",
        de: "",
        "class": null
    }, {"id": "tm", en: "", de: "", "class": null}, {"id": "kz", en: "", de: "", "class": null}, {
        "id": "il",
        en: "",
        de: "",
        "class": null
    }, {"id": "sa", en: "", de: "", "class": null}, {"id": "iq", en: "", de: "", "class": null}, {
        "id": "az",
        en: "",
        de: "",
        "class": null
    }, {"id": "ir", en: "", de: "", "class": null}, {"id": "ge", en: "", de: "", "class": null}, {
        "id": "sy",
        en: "",
        de: "",
        "class": null
    }, {"id": "am", en: "", de: "", "class": null}, {"id": "lb", en: "", de: "", "class": null}, {
        "id": "ru-main",
        en: "",
        de: "",
        "class": null
    }, {"id": "lakes", en: "", de: "", "class": null}, {
        "id": "rs",
        en: "",
        de: "",
        "class": "cet"
    }, {"id": "ru-kaliningrad", en: "", de: "", "class": "europe ru"}, {"id": "me", en: "", de: "", "class": "cet"}];
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

    directItem: function (clientId, msg) {
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
        console.log("stepId=" + this.stepId);
        //restart at step 0 when at the end
        if (this.stepId >= this.decks[this.deckId].items.length) {
            this.stepId = 0;
            msg += ": no more items - ";
        }

        var item = this.getItem();

        //log-nachricht
        msg += " stepping to " + this.deckId + "/" + this.stepId + " (" + item.type + ")";
        this.log(msg);


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

    executeStep: function (item, param) {
        this.mapItemToDevice(item, param);

        //der master soll mitkriegen, welcher step gerade ausgeführt wird
        this.sendPlaybackStatus();

        //checken, wie der nächste step getriggert wird
        if (this.stepId + 1 < this.decks[this.deckId].items.length) {
            if (this.decks[this.deckId].items[this.stepId + 1].trigger == "follow") {
                this.step();
            }
        }
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

    start: function () {
        console.log(this.conf);
        if (this.play == false) {
            var g = this;
            mongoConnection(function (db) {
                db.collection('decks').find({}).toArray(function (err, decks) {
                    if (err) return next(err);
                    g.decks = decks;
                    g.decks.forEach(function (deck, id) {
                        if (String(deck._id) == String(g.conf.startDeckId)) g.deckId = id;
                    });
                    //g.prepareSequence();
                    g.step("", 0);
                });
            });
            this.play = true;
            this.log("client started game");
            //wsManager.msgDevicesByRole('player', 'rates', {avgRating: this.avgRatings});
        } else {
            this.log("already playing");
        }
    },
    prepareSequence: function() {
        var deck = this.decks[this.deckId];
        this.sequence = new SequenceItem({type:"card", title:"Step Null!"});
        for (var i = 0; i < deck.items.length; i++) {
            this.sequence.appendItem(new SequenceItem(deck.items[i],i));
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
