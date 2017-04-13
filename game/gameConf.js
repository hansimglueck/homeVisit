(function() {
    'use strict';

    var mongoConnection = require('../homevisit_components/mongo/mongoConnection.js');
    var wsManager = require('./wsManager.js');
    var clone = require('clone');
    var logger = require('log4js').getLogger();
    var sessionRestriction = {$or:[{date:{$gt:new Date(Date.now()-7*24*60*60*1000).toISOString()}}, {sessionId:1}]};

    function GameConf() {
        this.conf = {};         //fixe Kongiguration wie startDeck, typeMapping
        this.defaultOptions = {
            alertRecipients: 'button:gruen,digits,speaker'
        };
        this.options = clone(this.defaultOptions);      //veränderliche optionen wie alertRecipients
        this.maxPlayerCnt = 8;
        this.gettext = require('./gettext');
    }

    GameConf.prototype = {
        syncFromDb: function (cb) {
            //wird zur initialisierung aufgerufen, aber auch aus routes/gameConf bei einer PUT-Aktion
            var self = this;
            mongoConnection(function (db) {
                db.collection('gameconfs').find({role: 'run'}).toArray(function (err, conf) {
                    self.conf = conf[0];
                    if (conf.length === 0) {
                        self.conf = {
                            role: 'run',
                            startDeckId: 0,
                            autostart: false, //not used???
                            playerCnt: 1,  //not used
                            typeMapping: [],
                            language: 'en',
                            session: null
                        };
                        db.collection('gameconfs').insertOne(self.conf, function(err, conf) {
                            if (err !== null) {
                                throw new Error(err.stack);
                            }
                            logger.info('No gameConf found. Created a default.');
                            if (cb) {
                                cb();
                            }
                        });
                    }
                    else {
			//TODO: since conf is not implemented as promise, we have to send the language to the printer, when we get it from the database (later then the printer requests it...)
			self.languageChange();
                        if (cb) {
                            cb();
                        }
                    }
                    self.gettext.textdomain(self.conf.language);
                });
            });
        },
        setOption: function(field, value) {
            this.options[field] = value;
        },
        getOption: function(field) {
            if (typeof this.options[field] !== "undefined") {
                return this.options[field];
            }
            return false;
        },
        confRequest: function(clientId, role, message) {
            var self = this;
            wsManager.msgDeviceByIds([clientId], "gameConf", {startDeckId: self.conf.startDeckId});
        },
        gameSessionsRequest: function(clientId, role) {
            var self = this;
            mongoConnection(function (db) {
                db.collection('sessions').find(sessionRestriction).toArray(function(err, sessions) {
                    if (err !== null) {
                        throw new Error(err.stack);
                    }
                    wsManager.msgDeviceByIds([clientId], 'gameSessions', {
                        currentSession: self.conf.session,
                        sessions: sessions
                    });
                });
            });
        },
        setGameSession: function(clientId, role, data) {
            var sessionId = data.data, self = this;
            mongoConnection(function (db) {
                db.collection('gameconfs').updateOne(
                    { _id: self.conf._id },
                    { $set: { session: sessionId } }, {},
                    function(err, conf) {
                        if (err !== null) {
                            throw new Error(err.stack);
                        }
                        self.conf.session = sessionId;
                        logger.info('Setting session to: %s'.format(sessionId));
                    }
                );
            });
        },
        languageRequest: function(clientId, role) {
            wsManager.msgDeviceByIds([clientId], 'languageChange', {
                language: this.conf.language
            });
        },
        languageChange: function() {
            var self = this;
            ['master', 'MC', 'player', 'printer'].forEach(function(role) {
                wsManager.msgDevicesByRole(role, 'languageChange', {
                    language: self.conf.language
                });
            });
        },
        changeLanguage: function(clientId, role, data) {
            var self = this;
            this.conf.language = data.data;
            this.gettext.textdomain(this.conf.language);
            mongoConnection(function (db) {
                db.collection('gameconfs').updateOne({ _id: self.conf._id }, { $set: { language: self.conf.language } }, {}, function(err, conf) {
                    if (err !== null) {
                        throw new Error(err.stack);
                    }
                    else {
                        self.languageChange();
                    }
                });
            });
        }
    };

    var gameConfObj = new GameConf();

    module.exports = gameConfObj;

})();
