(function () {
    'use strict';

    var _ = require('underscore');
    var Q = require('q');
    var clone = require('clone');

    var wsManager = require('./wsManager.js');
    var playerManager = require('./playerManager.js');
    var SequenceItem = require('./items/SequenceItem.js');
    var mongoConnection = require('../homevisit_components/mongo/mongoConnection.js');
    var gameConf = require('./gameConf');
    var gameClock = require('./clock');
    var gameRecording = require('./gameRecording');
    var logger = require('log4js').getLogger();


    function Game() {
        this.play = false;
        this.deckId = 0;
        this.stepIndex = 0;
        this.decks = [];
        this.conf = {};
        this.polls = [];
        this.sequence = null;
        this.alertState = 0;    //0: Alarmstufe off,  1: Alarmstufe an, 2: Alarmstufe blink
        this.clock = gameClock;
        this.recording = gameRecording;
        this.gettext = require('./gettext');
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
                if (typeof msg.data.param !== "undefined") {
                    param = msg.data.param;
                }

                logger.info("game.trigger: " + msg.data.cmd + " with parameter: " + param);
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
                        if (this.alertState !== 0) {
                            this.alertState = 2;
                            this.alert();
                        }
                        this.step(param);
                        break;

                    case "jump":
                        if (this.alertState !== 0) {
                            this.alertState = 2;
                            this.alert();
                        }
                        if (this.sequence !== null) {
                            this.sequence.jumpStep(parseInt(param));
                        }
                        break;

                    case "rego":
                        logger.info('rego');
                        if (this.sequence !== null) {
                            this.sequence.restep(parseInt(param));
                        }
                        break;

                    case "goto":
                        logger.info('goto');
                        if (this.sequence !== null) {
                            this.sequence.stepToIndex(0, parseInt(param));
                        }
                        break;

                    case "back":
                        logger.info('back');
                        if (this.sequence !== null) {
                            this.sequence.back(parseInt(param));
                        }
                        break;

                    default:
                        logger.info("game received unknown command: " + msg.type);
                }
            } catch (e) {
                logger.info("ERROR in game.trigger! " + e.stack);
            }
        },
        alert: function () {
            this.alertState += 1;
            this.alertState %= 3;
            var self = this;
            var recipients = gameConf.getOption("alertRecipients").split(",");
            logger.info("alertRecipients:");
            logger.info(recipients);

            recipients.forEach(function (recipient) {
                recipient = recipient.trim();
                var role = recipient.split(":")[0];
                var name = recipient.split(":")[1];
                if (role !== 'player') {
                    wsManager.msgDevicesByRoleAndName(role, name, "display", {type: "alert", param: self.alertState});
                }
                else {
                    playerManager.deliverMessage(recipient, "display", {type: "alert", param: self.alertState});
                }
            });
        },

        log: function (message) {
            message = "GAME: " + message;
            wsManager.msgDevicesByRole("master", "log", message);
        },

        step: function (param, id) {
            var self = this;
            if (this.sequence === null) {
                this.start(function () {
                    self.sequence.step(param, id);
                });
            }
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
            playerManager.resetPlayers();
            gameConf.options = clone(gameConf.defaultOptions); // reset the options when game restarts
            if (this.sequence !== null) {
                this.sequence.finish();
            }
            var g = this;
            this.clock.reset();
            this.recording.reset();
            mongoConnection(function (db) {
                db.collection('decks').find({}).toArray(function (err, decks) {
                    if (err) {
                        return err;
                    }
                    g.decks = decks;
                    g.decks.forEach(function (deck, id) {
                        if (String(deck._id) === String(gameConf.conf.startDeckId)) {
                            g.deckId = id;
                        }
                    });
                    g.prepareSequence(db, function (sequence) {
                        //sequence.step();
                        //g.step("", 0);
                        sequence.sendPlaybackStatus();
                        if (callback) {
                            callback();
                        }
                    });
                });
            });
            this.log("client started game");
            //wsManager.msgDevicesByRole('player', 'rates', {avgRating: this.avgRatings});
        },

        prepareSequence: function (db, cb) {
            var deck = this.decks[this.deckId];

            // load items from db
            var promises = [];
            deck.items.forEach(function (item, i) {
                promises.push(new SequenceItem(db, deck.items[i], i));
            });

            var self = this;
            this.sequence = [];

            return Q.allSettled(promises).then(function (results) {
                // unpack & respect order
                var items = _.sortBy(_.pluck(results, 'value'), 'index');
                items.forEach(function (item, i) {
                    if (self.sequence.length === 0) {
                        self.sequence = items[i];
                    }
                    else {
                        self.sequence.appendItem(items[i]);
                    }
                });
                cb(self.sequence);
            }).catch(function (err) {
                logger.info('Error loading items:', err);
                throw new Error(err.stack);
            }).done();
        },

        sendPlayBackStatus: function (clientId, role) {
            if (role !== "MC" && role !== "master") {
                return;
            }
            if (this.sequence !== null) {
                this.sequence.sendPlaybackStatus();
            }
        },

        pollResults: function (clientId, role, data) {
            if (role !== 'MC') {
                return;
            }
            this.recording.answers(data.data);
        },

        uploadRecording: function (clientId, role, data) {
            if (role !== 'MC') {
                return;
            }
            try {
                this.recording.uploadAllNew();
                //this.recording.upload(data.data.id, data.data.sid);
            } catch (e) {
                logger.info("ERROR in uploadRecording: "+ e.stack);
            }
        },
        vote: function (clientId, role, data) {
            data = data.data;
            //player-votes werden vom playerManager behandelt
            if (role === "player") return;
            var pollId = data.pollId;
            logger.info("Got Vote for " + pollId + " from " + role);
            var poll = this.sequence.polls[pollId];
            if (typeof poll === "undefined") {
                wsManager.msgDeviceByIds([clientId], "display", {
                    text: this.gettext.gettext("This poll doesn't exist!")
                });
                return;
            }
            poll.vote(data);
        }

    };

    var gameObj = new Game();

    module.exports = gameObj;

})();
