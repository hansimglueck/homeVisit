var Q = require('q');
var mongoConnection = require('../../server/mongoConnection.js');
var OptionPoll = require('../polls/OptionPoll.js');
var NumberPoll = require('../polls/NumberPoll.js');
var Agreement = require('../polls/Agreement.js');
var data = require('../data.js');
var gameConf = require('../gameConf');
var game = require('../game');
var wsManager = require('../wsManager.js');
var playerManager = require('../playerManager.js');


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


SequenceItem = function (db, itemRef, index, dontLoadItem) {

    function buildItem(self, item) {
        for (var attr in item) {
            if (item.hasOwnProperty(attr)) self[attr] = item[attr];
        }
        if (!self.time) self.time = 0;
        self.wait = parseInt(self.wait) || 0;
        self.next = null;
        self.previous = null;
        self.started = false;
        self.done = false;
        self.index = -1;
        if (typeof index != "undefined") self.index = index;
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
        var findItems = db.collection('items').find({ _id: itemRef });
        var toArray = Q.nbind(findItems.toArray, findItems);
        return toArray().then(function(item) {
            return buildItem(self, item[0]);
        });
    }
};

SequenceItem.prototype = {
    polls: {},

    reset: function () {
        this.done = false;
        this.started = false;
        if (this.next != null) this.next.reset();
    },
    log: function (message, ws) {
        console.log("Sequence.log: " + message);
        if (ws) wsManager.msgDevicesByRole("master", "log", message);
    },
    setIndex: function (index) {
        this.index = index;
    },
    appendItem: function (item) {
        if (item === null)
            return;
        if (this.next === null) {
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
    //falls nötig, kann dem step etwas param mitgegeben werden - zB der index eines go-buttons
    step: function (param) {
        if (!this.done) {
            if (this.previous !== null) this.previous.finish();
            this.done = true;
            this.param = param;
            var self = this;
            this.log("stepped into " + this.index + ": " + this.type, true);
            this.log("executing in " + this.wait + " sec");
            setTimeout(function () {
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
            this.step(param)
        }
        else if (this.next !== null) {
            this.done = true;
            this.next.stepToIndex(param, index);
        }
    },
    restep: function () {
        if (this.next === null || !this.next.done && this.done) {
            this.reset();
            this.step();
        } else if (this.next !== null) this.next.restep();
    },
    back: function () {
        if (this.next === null || !this.next.done && this.done) {
            if (this.previous !== null) this.previous.reset();
            if (this.previous !== null) this.previous.step();
        } else if (this.next !== null) this.next.back();
    },
    execute: function () {
        this.log("executing step " + this.index + ": " + this.type, true);
        this.sendPlaybackStatus();
        switch (this.type) {
            case "switch":
                //TODO: der switch muss wohl wieder implementiert werden, wenns komplexer werden soll
                //ähnlich wie inline-switch, nur dass das deck vom game geholt werden muss...
                break;
            case "inlineSwitch":
                this.log("looking for deck for option " + this.param);
                if (typeof this.inlineDecks === "undefined")
                    break;
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
                        this.appendItem(new SequenceItem(null, deck.items[i], this.index + ":" + this.param + ":" + i, true));
                    }
                    this.appendItem(oldNext);
                    this.step();
                }
                break;
            case "agreement":
                this.playerIds = playerManager.getPlayerGroup(this.agreementOption).map(function (player) {
                    return player.playerId;
                });
                this.setupPoll();
                this.mapToDevice();
                break;
            case "roulette":
                this.playerIds = playerManager.getPlayerGroup('joined').map(function (player) {
                    return player.playerId;
                });
                this.setupPoll();
                this.mapToDevice();
                break;
            case "vote":
                this.setupPoll();
                this.mapToDevice();
                break;
            case "deal":
                this.mapToDevice();
                break;
            case "results":
                //der score wird hier ermittelt, da das result ja auch zB an den printer geschickt werden könnte, dann käme playerManager.result() garnicht dran
                this.data = {};
                switch (this.sourceType) {
                    case "previousStep":
                        this.data = this.previous.getData();
                        break;
                    case "positivePlayerScore":
                        var posScoreArr = playerManager.players.filter(function (player, id) {
                            player.playerId = id;
                            return player.score > 0;
                        });
                        var sum = posScoreArr.reduce(function (prev, curr) {
                            return prev + curr.score
                        }, 0);
                        this.data.text = "Die Verteilung des Kuchens";
                        this.data.voteOptions = posScoreArr.map(function (player) {
                            return {
                                value: player.playerId,
                                result: player.score,
                                votes: player.score,
                                text: player.playerId,
                                percent: (player.score / sum * 100).toFixed(1)
                            }
                        });
                        break;
                    default:
                        break;
                }
                switch (this.scoreType) {
                    case "optionScore":
                        //checke, welche votes eine option mit .correctAnswer in der choice haben
                        //und verteile +1 für jede korrekte choice, -1 für die anderen
                        var correct = this.data.voteOptions.filter(function (opt) {
                            return opt.correctAnswer
                        }).map(function (opt) {
                            return opt.value
                        });
                        var score;
                        this.data.votes.forEach(function (vote) {
                            score = -1;
                            vote.choice.forEach(function (ch) {
                                if (correct.indexOf(ch) != -1) score = 1;
                            });
                            playerManager.score(vote.playerId, score);
                        });
                        break;
                    case "majorityScore":
                        //checke, welche votes die voteOption[0] der results (sortiert) in der choice haben
                        //und verteile +1 dafür, -1 für die anderen
                        //TODO: bei zwei gleichguten Antworten wird nur eine berücksichtigt...
                        var best = this.data.voteOptions[0].value;
                        var score;
                        this.data.votes.forEach(function (vote) {
                            score = -1;
                            vote.choice.forEach(function (ch) {
                                if (best == ch) score = 1;
                            });
                            playerManager.score(vote.playerId, score);
                        });
                        break;

                    case "noScore":
                    default:
                        break;
                }
                this.mapToDevice();
                if (this.autoGo) {
                    //führe nächsten step aus mit param = value der bestOption
                    this.step(this.data.complete ? this.data.voteOptions[0].value : -1);
                }
                break;
            case "config":
                gameConf.setOption(this.configField, this.value);
                break;
            case "dummy":
                if (this.next !== null) this.next.step(this.param);
                break;
            case "eval":
                console.log("Eval: " + this.text);
                try {
                    eval(this.text);
                } catch (e) {
                    this.log("Error = "+ e.stack);
                }
                break;
            default:
                this.mapToDevice();
                break;
        }
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
        if (typeof this.device == "undefined" || typeof this.device == "string" || this.device[0] == "default") map = gameConf.conf.typeMapping.filter(function (tm) {
            return (tm.type == self.type);
        })[0];
        //oder an die speziell gewünschten devices senden
        else {
            map.devices = this.device;
        }
        if (typeof map === "undefined" || map.devices.length == 0) {
            this.log("keine Devices gefunden für " + this.type, true);
            return;
        }
        map.devices.forEach(function (dev) {
            self.log("sending to " + dev + ": " + self.text);
            //statt device player wird der playerManager verwendet
            //dieser bekommt das ganze item-objekt
            //alle anderen devices bekommen nur, getWsContent()
            //es kann auch zB player:next geben...
            if (dev.indexOf("player") == 0) {
                playerManager.addItem(self, dev);
                return;
            }
            //ist ein spezieller device-name angegeben? ZB für die buttons: button:red
            if (dev.indexOf(':') != -1) {
                wsManager.msgDevicesByRoleAndName(dev.split(':')[0], dev.split(':')[1], "display", self.getWsContent());
                return;
            }
            var c = self.getWsContent();
            wsManager.msgDevicesByRole(dev, "display", c);
        });

    },
    getWsContent: function () {
        //objekt mit den relevanten daten zum senden vorbereiten
        var content = {};
        switch (this.type) {
            case "cmd":
                content = {
                    type: this.type,
                    command: this.text,
                    param: this.parameter,
                    device: this.device
                };
                break;
            case "roulette":
            case "agreement":
            case "vote":
                content = this.poll.getWsContent();
                break;
            case "rating":
                var bestWorst;
                var bestWorstArr;
                if (this.ratingType == "oneTeam") {
                    bestWorstArr = playerManager.getPlayerGroup(this.bestWorst);
                    if (bestWorstArr.length > 0) bestWorst = bestWorstArr.map(function(x){return x.playerId}).playerId;
                }
                content = {
                    type: this.type,
                    ratingType: this.ratingType,
                    posNeg: this.posNeg,
                    playerId: bestWorst,
                    text: this.text
                };
                break;
            case "results":
                content = {
                    data: this.data,
                    type: this.type,
                    text: this.data.text,
                    resultType: this.resultType,
                    color: this.color
                };
                break;
            case "deal":
                content = {
                    type: this.type,
                    text: this.text,
                    dealType: this.dealType,
                    maxSteps: this.maxSteps
                };
                break;
            default:
                content = {
                    type: this.type,
                    text: this.text
                };
                break;
        }
        content.silent = this.silent;
        return content;
    },
    setupPoll: function () {
        var self = this;
        var poll;
        if (this.type === "agreement") {
            poll = new Agreement(this);
            poll.onFinish(playerManager, function (result) {
                if (result.fullfilled) playerManager.setAgreement(poll);
                poll.playerIds.forEach(function (pid) {
                    playerManager.sendMessage(pid, "display", {type: "card", text: result.text});
                })
            })
        }
        else if (this.type === "roulette") {
            poll = new Agreement(this);
            poll.onFinish(playerManager, function(result) {
                result.win = self.win;
                result.cost = self.cost;
                playerManager.playRoulette(result);
            })
        }
        else {
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
        }
        this.poll = poll;
        this.getData = function () {
            return this.poll.getResult();
        };
        this.polls[this.poll.id] = (this.poll);
    },
    sendPlaybackStatus: function () {
        if (this.done) {
            if (this.next !== null) this.next.sendPlaybackStatus();
        }
        var playbackStatus = {
            done: this.done,
            stepIndex: this.index,
            type: this.type,
            deckId: gameConf.conf.startDeckId
        };
        wsManager.msgDevicesByRole('master', 'playBackStatus', playbackStatus);
        wsManager.msgDevicesByRole('MC', 'playBackStatus', playbackStatus);
    },
    //TODO: hacky closing the deals - das geht besser
    finish: function () {
        if (!this.done) return;
        if (this.next !== null) this.next.finish();
        this.log("finishing step " + this.index + ": " + this.type, true);
        Object.keys(playerManager.deals).forEach(function (key) {
            var deal = playerManager.deals[key];
            if (deal.state < 3) deal.state = 4;
            playerManager.sendMessage(deal.player0Id, "deal", deal);
            playerManager.sendMessage(deal.player1Id, "deal", deal);
            playerManager.players[deal.player0Id].busy = false;
            playerManager.players[deal.player1Id].busy = false;
            playerManager.sendPlayerStatus(-1);
        });

    }

};
module.exports = SequenceItem;
