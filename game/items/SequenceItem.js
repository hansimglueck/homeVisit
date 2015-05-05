(function () {
    'use strict';

    var Q = require('q');
    var gameConf = require('../gameConf');
    var gameClock = require('../clock');
    var wsManager = require('../wsManager.js');
    var playerManager = require('../playerManager.js');
    var _ = require('underscore');


    /*
     Ablauf:
     step(param, index) wird aufgerufen entweder durch eine "go"-playbackAction oder vom letzten step
     param:  unterschiedliche hardware-buttons senden ihre index als param mit, zur Unterscheidung von switches
     results mit auto-go senden hier die index der besten Option mit


     Item-Struktur:

     allgemein:
     item.trigger:   "follow"/"go" - soll der step ausgeführt werden nach einem "go" oder automatisch?
     item.wait:      Zeit in Sekunden nach trigger, bevor der Step ausgeführt wird
     item.comment:   Freifeld für Kommentare
     item.highlight: 1 für highlight in der Darstellung
     item.mcnote:   eine Notiz für den mc

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
     item.resultType: In welcher Form sollen Ergebnisse dargestellt werden? Pie/Bar/Line/seatOrder/europeMap/numberStats
     die Darstellung obliegt dem Zieldevice
     item.scoreType: noScore/optionScore/majorityScore - für results von votes sollen die player gescort werden
     item.autoGo:    soll direkt der nächste step getriggert werden (zB für switch nach result)
     - der value der besten Option wird als param mitgegeben, wenn die poll nicht mehr open ist, sonst -1
     item.color:    in welcher Farbe werden die Ergebnisse (bei map-Darstellung) angezeigt

     item.type = "rating"
     ... TODO: DOKU!

     item.type = "switch"
     item.options:   array of {value, followUp: deck-id}

     item.type = "inlineSwitch"
     item.inlineDecks:   array of decks

     item.type = "config"
     item.configField:  name des konfigurierbaren Wertes (zB alertRecipients)
     item.value:        Wert des Wertes

     item.type = "agreement"
     wird intern wie eine spezielle Poll (Objecttype Agreement) behandelt.
     item.agreementType:        ['alliance'] - TODO: agreete Allianzen werden im player-Array unter .allied als Array geführt
     item.agreementOptions:     ['topTwo'] - die besten zwei werden im

     */

    var SequenceItem = function (db, itemRef, index, dontLoadItem) {

        function buildItem(self, item) {
            for (var attr in item) {
                if (item.hasOwnProperty(attr)) {
                    self[attr] = item[attr];
                }
            }
            if (!self.time) {
                self.time = 0;
            }
            self.wait = parseInt(self.wait) || 0;
            self.next = null;
            self.previous = null;
            self.done = false;
            self.finished = false;
            self.timeout = null;
            self.index = -1;
            if (typeof index !== "undefined") {
                self.index = index;
            }
            //this.poll = null;
            return self;
        }

        // itemRef is object (for inlineswitch)
        if (dontLoadItem) {
            return buildItem(this, itemRef);
        }
        // itemRef is hash/id
        else {
            var self = this;
            var findItems = db.collection('items').find({_id: itemRef});
            var toArray = Q.nbind(findItems.toArray, findItems);
            return toArray().then(function (item) {
                return buildItem(self, item[0]);
            });
        }
    };

    SequenceItem.prototype = {
        polls: {},

        reset: function () {
            this.log("resetting item " + this.index);
            this.done = false;
            this.finished = false;
            this.resetItem();
            if (this.next !== null) {
                if (this.next.done) {
                    this.next.reset();
                }
            }
        },
        resetItem: function () {
            //nothing here, just for special reset-functionality of special items (aka inlineSwitch-items)
            return this;
        },
        log: function (message, ws) {
            console.log("Sequence.log: " + message);
            if (ws) {
                wsManager.msgDevicesByRole("master", "log", message);
            }
        },
        setIndex: function (index) {
            this.index = index;
        },
        appendItem: function (item) {
            if (item === null) {
                return;
            }
            if (this.next === null) {
                this.next = item;
                this.next.setPrevious(this);
            }
            else {
                this.next.appendItem(item);
            }
        },
        insertItem: function (item) {
            item.setNext(this.next);
            item.setPrevious(this);
            this.next = item;
        },
        deleteItem: function () {
            this.log("deleting item " + this.index);
            if (this.previous !== null) {
                this.previous.setNext(this.next);
                if (this.next !== null) this.next.setPrevious(this.previous);
            }
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
        //falls nötig, kann dem step etwas param mitgegeben werden - zB der index eines go-buttons
        step: function (param) {
            if (!this.done) {
                if (this.previous !== null) {
                    this.previous.finish();
                }
                this.done = true;
                this.param = param;
                var self = this;

                // game clock starts at card number 2!
                if (this.index === 1) {
                    gameClock.start();
                }

                this.log("stepped into " + this.index + ": " + this.type, true);
                this.log("executing in " + this.wait + " sec");
                var itemRequire = {};
                try {
                    itemRequire = require('./includes/' + this.type);
                    //console.log(require('./includes/' + this.type));
                } catch (e) {
                    itemRequire = require('./includes/default');
                }
                _.extend(this, itemRequire);
                /*
                 if (typeof itemRequire.executeItem !== "undefined") this.executeItem = itemRequire.executeItem;
                 if (typeof itemRequire.getWsContent !== "undefined") this.getWsContent = itemRequire.getWsContent;
                 if (typeof itemRequire.finishItem !== "undefined") this.finishItem = itemRequire.finishItem;
                 */
                this.timeout = setTimeout(function () {
                    self.execute.call(self);
                }, this.wait * 1000);
                return true;
            }
            else {
                if (this.next !== null) {
                    return this.next.step(param);
                }
            }
            return false;
        },
        //und den ziel-step-index (die wird dann auf jedenfall angefahren, auch wenn schon done)
        stepToIndex: function (param, index) {
            this.log("stepping to nr " + index);
            if (index === this.index) {
                this.reset();
                this.step(param);
            }
            else if (this.next !== null) {
                this.done = true;
                this.next.stepToIndex(param, index);
            }
        },
        restep: function (param) {
            if (this.next === null || !this.next.done && this.done) {
                this.reset();
                this.previous.step(param);
            }
            else if (this.next !== null) {
                this.next.restep(param);
            }
        },
        back: function (param) {
            this.log("back on item " + this.index);
            if (this.next === null || !this.next.done && this.done) {
                if (this.previous !== null) {
                    //wenn .previous ein inlineSwitch IST, dann resetten und noch einen zurückgehen
                    if (this.previous.type === "inlineSwitch") {
                        this.previous.reset();
                        this.previous.previous.reset();
                        this.previous.previous.step(param);
                    }
                    else {
                        this.previous.reset();
                        this.previous.step(param);
                    }
                }
            }
            else if (this.next !== null) {
                this.next.back(param);
            }
        },
        execute: function () {
            this.log("executing step " + this.index + ": " + this.type, true);
            this.executeTime = new Date();
            console.log(this.executeTime);
            this.sendPlaybackStatus();
            this.executeItem();
            //checken, wie der nächste step getriggert wird
            if (this.next !== null) {
                if (this.next.trigger === "follow") {
                    this.step();
                }
            }
        },
        executeItem: function () {
        },
        getWsContent: function () {
        },
        mapToDevice: function () {
            //sich selbst an die konfigurierten default-devices senden
            //entweder komplett (wenn an playerManager), oder reduzierter content (wenn über WS)
            var map = {};
            var self = this;
            if (typeof this.device === "undefined" ||
                typeof this.device === "string" ||
                this.device[0] === "default") {
                map = gameConf.conf.typeMapping.filter(function (tm) {
                    return tm.type === self.type;
                })[0];
            }
            //oder an die speziell gewünschten devices senden
            else {
                map.devices = this.device;
            }
            if (typeof map === "undefined" || map.devices.length === 0) {
                this.log("keine Devices gefunden für " + this.type, true);
                return;
            }
            map.devices.forEach(function (dev) {
                self.log("sending to " + dev + ": " + self.text);
                //statt device player wird der playerManager verwendet
                //dieser bekommt das ganze item-objekt
                //alle anderen devices bekommen nur, getWsContent()
                //es kann auch zB player:next geben...
                if (dev.indexOf("player") === 0) {
                    playerManager.addItem(self, dev);
                    return;
                }
                //ist ein spezieller device-name angegeben? ZB für die buttons: button:red
                if (dev.indexOf(':') !== -1) {
                    wsManager.msgDevicesByRoleAndName(dev.split(':')[0], dev.split(':')[1], "display", self.getWsContent());
                    return;
                }
                var c = self.getWsContent();
                wsManager.msgDevicesByRole(dev, "display", c);
            });

        },
        sendPlaybackStatus: function () {
            if (!this.isOnTurn()) {
                this.next.sendPlaybackStatus();
            }
            else {
                var playbackStatus = {
                    done: this.done,
                    stepIndex: this.index,
                    type: this.type,
                    deckId: gameConf.conf.startDeckId,
                    clockSeconds: gameClock.getCurrentSeconds()
                };
                wsManager.msgDevicesByRole('master', 'playBackStatus', playbackStatus);
                wsManager.msgDevicesByRole('MC', 'playBackStatus', playbackStatus);
            }
        },
        //TODO: hacky closing the deals - das geht besser
        finish: function () {
            if (!this.isOnTurn()) {
                this.next.finish();
            }
            else {
                this.log("finishing step " + this.index + ": " + this.type, true);
                clearTimeout(this.timeout);
                this.finishItem();
            }
        },
        finishItem: function () {
        },

        getExecuteTime: function () {
            var my = {id: this.id, time: this.executeTime};
            var rest = [];
            if (this.next === null) {
                console.log("ende");
                console.log();
                rest.push(my);
                return rest;
            }
            else {
                rest = this.next.getExecuteTime();
                rest.push(my);
                return rest;
            }
        },

        isOnTurn: function () {
            if (this.next === null) {
                return true;
            }
            return this.done && !this.next.done;
        },

        getData: function () {
            if (this.previous !== null) {
                return this.previous.getData();
            }
            return null;
        }
    };

    module.exports = SequenceItem;

})();
