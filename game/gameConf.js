var mongoConnection = require('../mongoConnection');

function GameConf() {
    this.conf = {};         //fixe Kongiguration wie startDeck, typeMapping
    this.options = {alertRecipients: "button"};      //veränderliche optionen wie alertRecipients
}

GameConf.prototype = {
    syncFromDb: function () {
        //wird zur initialisierung aufgerufen, aber auch aus routes/gameConf bei einer PUT-Aktion
        var self = this;
        mongoConnection(function (db) {
            db.collection('gameconfs').find({role: 'run'}).toArray(function (err, conf) {
                self.conf = conf[0];
                if (conf.length == 0) self.conf = {
                    role: 'run',
                    startDeckId: 0,
                    autostart: false,
                    playerCnt: 1,
                    typeMapping: []
                };
                console.log("autostart=" + self.conf.autostart);
            });
        });
    },
    setOption: function(field, value) {
        this.options[field] = value;
    },
    getOption: function(field) {
        if (typeof this.options[field] != "undefined") return this.options[field];
        else return false;
    }
};

var gameConfObj = new GameConf();

module.exports = gameConfObj;
