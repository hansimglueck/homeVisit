var wsManager = require('./wsManager.js');

PlayerManager = function () {
    this.players = [];
    this.colors = [
        ["rot", "gelb"],
        ["rot", "blau"],
        ["rot", "weiss"],
        ["rot", "gruen"],
        ["rot", "pink"],
        ["gelb", "blau"],
        ["gelb", "weiss"],
        ["gelb", "gruen"],
        ["gelb", "pink"],
        ["blau", "weiss"],
        ["blau", "gruen"],
        ["blau", "pink"],
        ["weiss", "gruen"],
        ["weiss", "pink"],
        ["pink", "schwarz"]
    ];
    this.rating = [];
    this.avgRating = [];
    this.conf = {
        playerCnt: 15
    }
    this.joinedPlayers = 0;

};

PlayerManager.prototype = {
    init: function () {
        for (var i = 0; i < this.colors.length; i++) {
            this.players.push({
                clientId: -1,
                colors: this.colors[i],
                joined: false
            });
            this.rating[i] = [];
            for (var j = 0; j < this.colors.length; j++) {
                this.rating[i][j] = 4;
            }
        }
        console.log();
    },

    playerMessage: function (clientId, msg) {
        if (typeof msg != "undefined") switch (msg.type) {
            case "joinGame":
                this.requestJoin(clientId, msg.data);
                break;

            case "leaveGame":
                this.leaveGame(clientId);
                break;

            case "vote":
                //this.vote(clientId, msg);
                break;

            case "rate":
                this.rate(clientId, msg.data);
                break;

            case "chat":
                this.chat(clientId, msg.data);
                break;

            default:
                console.log("unknown message-type");
                break;

        }

    },

    chat: function (clientId, data) {
        var recId = this.players[data.recepient].clientId;
        wsManager.msgDeviceByIds([recId], "chat", {playerId: data.sender, message: data.message});

    },

    getPlayerIdForClientId: function (clientId) {
        var playerId = -1;
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].clientId == clientId) playerId = i;
        }
        return playerId;
    },

    leaveGame: function (clientId) {
        var playerId = this.getPlayerIdForClientId(clientId);
        this.players[playerId].joined = false;
        this.sendPlayerStatus(playerId);
    },

    requestJoin: function (clientId, msg) {
        //var client = this.clients[clientId];
        var playerId;        //der player, der zu diesem client gehört.
        //schau mal, ob es einen player gibt, der über diesen client gespielt hat
        //wen ja, sende diesen player
        //wenn nicht, schaue, ob noch ein platz frei ist und vergebe ihn
        playerId = this.getPlayerIdForClientId(clientId);
        if (playerId == -1) playerId = this.seatPlayer(clientId);
        if (playerId == -1) {
            //kein freier platz!
            wsManager.msgDeviceByIds([clientId], "status", {
                player: {playerId: -1},
                otherPlayers: this.getPlayerArray(),
                maxPlayers: this.conf.playerCnt
            });
            return;
        }
        if (!!this.lastPlayerMessage) client.socket.send(JSON.stringify({
            type: "display",
            data: this.lastPlayerMessage
        }));
        this.players[playerId].clientId = clientId;
        this.players[playerId].joined = true;
        this.sendPlayerStatus(playerId);
        //this.msgDevicesByRole('player', 'rates', {avgRating: this.avgRating});
    },

    sendPlayerStatus: function (playerId) {

        wsManager.msgDeviceByIds([this.players[playerId].clientId], "joined", {
            player: {
                playerId: playerId,
                joined: this.players[playerId].joined,
                colors: this.players[playerId].colors
            },
            rating: this.rating[playerId]
        });
        var msg = {
                otherPlayers: this.getPlayerArray(),
                maxPlayers: this.conf.playerCnt
        };
        wsManager.msgDevicesByRole("player", "status", msg);
    },

    getPlayerArray: function () {
        var ret = [];
        for (var i = 0; i < this.players.length; i++) {
            ret.push({joined: this.players[i].joined, playerId: i, colors: this.players[i].colors});
        }
        return ret;
    },

    seatPlayer: function (clientId) {
        //find available playerId:
        //1. check if there are unseated players (clientId == -1)
        //2. check if there are unjoined players
        var playerId = -1;
        for (var i = this.conf.playerCnt - 1; i >= 0; i--) {
            if (this.players[i].clientId == -1) playerId = i;
        }
        if (playerId == -1) {
            for (var i = this.conf.playerCnt - 1; i >= 0; i--) {
                if (this.players[i].joined == false) playerId = i;
            }
        }
        return playerId;
    }
    ,

    rate: function (clientId, data) {
        var playerId = data.playerId;
        var rate = data.rate;
        this.rating[playerId] = rate;
        console.log("rate: " + this.rating);
        this.calcAvgRate();
        wsManager.msgDevicesByRole('player', 'rates', {avgRating: this.avgRating});
    }
    ,

    calcAvgRate: function () {
        if (this.conf.playerCnt <= 1) {
            this.avgRating[0] = 4;
            return;
        }
        var sum,cnt;
        for (var j = 0; j < this.rating.length; j++) {
            sum = 0;
            cnt = 0;
            for (var i = 0; i < this.rating.length; i++) {
                if (i != j && this.players[i].joined) {
                    sum += this.rating[i][j];
                    cnt++;
                }
            }
            this.avgRating[j] = Math.round(sum /cnt);
        }
    }


}
;
var playerManagerObj = new PlayerManager();
playerManagerObj.init();

module.exports = playerManagerObj;