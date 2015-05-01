var mongoConnection = require('../homevisit_components/mongo/mongoConnection.js');
var wsManager = require('./wsManager.js');
var clone = require('clone');

function GameConf() {
    this.conf = {};         //fixe Kongiguration wie startDeck, typeMapping
    this.defaultOptions = {
        alertRecipients: 'button:gruen,digits'
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
                if (conf.length == 0) {
                    self.conf = {
                        role: 'run',
                        startDeckId: 0,
                        autostart: false, //not used???
                        playerCnt: 1,  //not used
                        typeMapping: [],
                        language: 'en'
                    };
                    db.collection('gameconfs').insertOne(self.conf, function(err, conf) {
                        if (err !== null) {
                            throw new Error(err.stack);
                        }
                        console.log('No gameConf found. Created a default.');
                        if (cb) cb();
                    });
                }
                else {
                    if (cb) cb();
                }
                self.gettext.textdomain(self.conf.language);
            });
        });
    },
    setOption: function(field, value) {
        this.options[field] = value;
    },
    getOption: function(field) {
        if (typeof this.options[field] != "undefined") return this.options[field];
        else return false;
    },
    confRequest: function(clientId, role, message) {
        var self = this;
        wsManager.msgDeviceByIds([clientId], "gameConf", {startDeckId: self.conf.startDeckId});
    },
    languageRequest: function(clientId, role) {
        wsManager.msgDeviceByIds([clientId], 'languageChange', {
            language: this.conf.language
        });
    },
    languageChange: function() {
        var self = this;
        ['master', 'MC', 'player'].forEach(function(role) {
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
