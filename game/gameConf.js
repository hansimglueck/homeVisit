var mongoConnection = require('../homevisit_components/mongo/mongoConnection.js');
var wsManager = require('./wsManager.js');

function GameConf() {
    this.conf = {};         //fixe Kongiguration wie startDeck, typeMapping
    this.options = {alertRecipients: "button:gruen,digits"};      //veränderliche optionen wie alertRecipients
    this.maxPlayerCnt = 8;
}

GameConf.prototype = {
    syncFromDb: function (cb) {
        //wird zur initialisierung aufgerufen, aber auch aus routes/gameConf bei einer PUT-Aktion
        var self = this;
        mongoConnection(function (db) {
            db.collection('gameconfs').find({role: 'run'}).toArray(function (err, conf) {
                self.conf = conf[0];
                if (conf.length == 0) self.conf = {
                    role: 'run',
                    startDeckId: 0,
                    autostart: false, //not used???
                    playerCnt: 1,  //not used
                    typeMapping: [],
                    language: 'en'
                };
                console.log("autostart=" + self.conf.autostart);
                if (cb) cb();
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
        if (role === 'MC') {
            this.conf.language = data.data;
            this.languageChange();
        }
    }
};

var gameConfObj = new GameConf();

module.exports = gameConfObj;
