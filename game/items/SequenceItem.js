var OptionPoll = require('../polls/OptionPoll.js');
var NumberPoll = require('../polls/NumberPoll.js');
var data = require('../data.js');
var gameConf = require('../gameConf');
var game = require('../game');
var wsManager = require('../wsManager.js');
var playerManager = require('../playerManager.js');


/*
 Ablauf:
 step(param, id) wird aufgerufen entweder durch eine "go"-playbackAction oder vom letzten step
 param:  unterschiedliche hardware-buttons senden ihre id als param mit, zur Unterscheidung von switches
 results mit auto-go senden hier die id der besten Option mit


 Item-Struktur:

 allgemein:
 item.trigger:   "follow"/"go" - soll der step ausgeführt werden nach einem "go" oder automatisch?
 item.wait:      Zeit in Sekunden nach trigger, bevor der Step ausgeführt wird

 item.type = "card"
 item.text:      Der Darzustellende Text

 item.type = "sound"
 item.text:      der abzuspielende Soundfile, "stop" = stoppe aktuell laufenen play.

 item.type = "vote"
 item.text:      Darzustellender Text; die Frage/Aufgabe
 item.voteType:  'customOptions','customMultipleOptions','playerChoice','countryChoice','enterNumber'
 einerseits sollen hier evtl. Optionen vorbereitet werden (playerChoice, countryChoice)
 andererseits entscheided das Zieldevice hiernach die Darstellung
 item.voteOptions: entweder werden diese vom admin explizit vorgegeben oder hier automatisch generiert
 item.voteMulti: wieviele Optionen können gewählt werden
 item.ratedVote: soll die Auswertung mit einem "multiplier" (im Moment Platzierung) gewichtet werden?
 item.time:      wieviel Zeit vor automatischer "Enthaltung" wird eingeräumt? 0 = keine Begrenzung
 item.percentsForFinish: ab wieviel % abgegebener Stimmen wird ausgewertet
 item.language:  wird genutzt, um zu entscheiden, welche Options-Texte für die Länderwahl verwendet werden

 item.type = "result"
 item.text:      Text
 item.dataSource: welche Daten sollen verwendet werden? previousStep/positivePlayerScore
 item.displayType: In welcher Form sollen Ergebnisse dargestellt werden? Pie/Bar/Line/seatOrder/europeMap/numberStats
 die Darstellung obliegt dem Zieldevice
 item.scoreType: noScore/optionScore/majorityScore - für results von votes sollen die player gescort werden
 item.autoGo:    soll direkt der nächste step getriggert werden (zB für switch nach result)

 item.type = "switch"
 item.options:   array of {value, followUp: deck-id}

 item.type = "inlineSwitch"
 item.inlineDecks:   array of decks

 */


SequenceItem = function (item, id) {
    for (var attr in item) {
        if (item.hasOwnProperty(attr)) this[attr] = item[attr];
    }
    if (!this.time) this.time = 0;
    this.wait = parseInt(this.wait) || 0;
    this.next = null;
    this.previous = null;
    this.done = false;
    this.id = -1;
    if (typeof id != "undefined") this.id = id;
    //this.poll = null;
};

SequenceItem.prototype = {
    polls: {},

    reset: function () {
        this.done = false;
        if (this.next != null) this.next.reset();
    },
    log: function (message, ws) {
        console.log("Sequence.log: " + message);
        if (ws) wsManager.msgDevicesByRole("master", "log", message);
    },
    setId: function (id) {
        this.id = id;
    },
    appendItem: function (item) {
        if (this.next == null) {
            this.next = item;
            this.next.setPrevious(this);
        }
        else this.next.appendItem(item);
    },
    insertItem: function (item) {
        item.setNext(this.next);
        item.setPrevious(this);
        this.next = item;
    },
    setPrevious: function (previousItem) {
        this.previous = previousItem;
    },
    getPrevious: function () {
        return this.previous;
    },
    setNext: function (nextItem) {
        this.next = nextItem;
    },
    getNext: function () {
        return this.next;
    },
    //falls nötig, kann dem step etwas data mitgegeben werden - zB die id eines go-buttons
    //TODO: ausserdem eine spezielle id eines auszuführenden steps. alle vorherigen steps werden dann auf done = true gesetzt
    step: function (param, id) {
        if (!this.done) {
            this.param = param;
            var self = this;
            this.log("stepped into " + this.id + ": " + this.type, true);
            this.log("executing in " + this.wait + " sec");
            setTimeout(function () {
                self.execute.call(self);
            }, this.wait * 1000);
            return true;
        }
        else if (this.next != null) return this.next.step(param, id);
        return false;
    },
    execute: function () {
        this.log("executing step " + this.id + ": " + this.type, true);
        this.done = true;
        switch (this.type) {
            case "switch":
                break;
            case "inlineSwitch":
                this.log("looking for deck for option " + this.param);
                var deck = this.inlineDecks[this.param];
                if (typeof deck == "undefined") {
                    this.log("no matching option found", true);
                    this.step();
                }
                else {
                    this.log("inserting deck for option " + this.param, true);
                    var oldNext = this.next;
                    this.next = null;
                    for (var i = 0; i < deck.items.length; i++) {
                        this.appendItem(new SequenceItem(deck.items[i], this.id + ":" + i));
                    }
                    this.appendItem(oldNext);
                    this.step();
                }
                break;
            case "vote":
                this.setupPoll();
                this.mapToDevice();
                break;
            case "results":
                this.log(this.sourceType);
                switch (this.sourceType) {
                    case "previousStep":
                        this.data = this.previous.getData();
                        this.mapToDevice();
                        break;
                    case "positivePlayerScore":
                        break;
                     default:
                        break;
                }
                if (this.autoGo) {
                    //führe nächsten step aus mit param = value der bestOption
                    this.step(this.data.voteOptions[0].value);
                }
                break;
            default:
                this.mapToDevice();
                break;
        }
        this.sendPlaybackStatus();
        //checken, wie der nächste step getriggert wird
        if (this.next != null) {
            if (this.next.trigger == "follow") {
                this.step();
            }
        }
    },
    mapToDevice: function () {
        //sich selbst an die konfigurierten default-devices senden
        //entweder komplett (wenn an playerManager), oder reduzierter content (wenn über WS)
        var map = {};
        var self = this;
        if (this.device == "default" || typeof this.device == "undefined") map = gameConf.conf.typeMapping.filter(function (tm) {
            return (tm.type == self.type);
        })[0];
        //oder an die speziell gewünschten devices senden
        else {
            map.devices = this.device.split(",");
        }
        if (map.devices.length == 0) this.log("keine Devices gefunden für " + this.type, true);
        map.devices.forEach(function (dev) {
            self.log("sending to " + dev + ": " + self.text);
            //statt device player wird der playerManager verwendet
            //es kann auch zB player:next geben...
            if (dev.indexOf("player") == 0) {
                playerManager.addItem(self);
                return;
            }
            //ist ein spezieller device-name angegeben? ZB für die buttons: button:red
            if (dev.indexOf(':') != -1) {
                wsManager.msgDevicesByRoleAndName(dev.split(':')[0], dev.split(':')[1], "display", self.getWsContent());
                return;
            }
            wsManager.msgDevicesByRole(dev, "display", self.getWsContent());
        });

    },
    getWsContent: function () {
        //objekt mit den relevanten daten zum senden vorbereiten
        var content;
        switch (this.type) {
            case "cmd":
                content = {
                    type: this.type,
                    command: this.text,
                    param: this.opts[0],
                    device: this.device
                };
                break;
            case "vote":
                this.poll = this.preparePoll();
                this.polls.push(this.poll);
                content = JSON.parse(JSON.stringify(this));   //=deep clone
                content.poll = this.polls[this.polls.length - 1];
                break;
            case "results":
                content = item;
                content.data = this.polls[this.polls.length - 1].getResult();
                console.log("item for result:");
                console.log(content);
                break;
            default:
                content = {
                    type: item.type,
                    text: item.text
                };
                //content = JSON.parse(JSON.stringify(item));   //=deep clone
                break;
        }
        return content;
    },
    setupPoll: function () {
        var self = this;
        var poll;
        switch (this.voteType) {
            case "customOptions":
            case "customMultipleOptions":
                this.voteOptions.forEach(function (opt, id) {
                    opt.value = id;
                });
                poll = new OptionPoll(this);
                break;
            case "playerChoice":
            case "countryChoice":
                var lang = this.language;
                this.voteOptions = data.getEUcountries().map(function (c) {
                    return {value: c.id, text: c[lang]}
                });
                poll = new OptionPoll(this);
                break;

            case "enterNumber":
                poll = new NumberPoll(this);
                break;
            default:
                break;
        }
        poll.onFinish(this, function (result) {
            //game.trigger(-1, {data: 'go'})
            this.step(result);
        });
        this.poll = poll;
        this.getData = function () {
            return this.poll.getResult();
        };
        this.polls[this.poll.id] = (this.poll);
    },
    sendPlaybackStatus: function () {
        wsManager.msgDevicesByRole('master', 'playBackStatus', {
            stepId: this.id,
            type: this.type
        });
    },

};
module.exports = SequenceItem;
