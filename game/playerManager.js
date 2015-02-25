PlayerManager = function() {
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
        ["pink", "grün"],
        ["pink", "schwarz"]
    ];
    this.rating = [];
    this.avgRating = [];

};

PlayerManager.prototype = {
    chat: function (clientId, data) {
        var recId = this.players[data.recepient].clientId;
        this.msgDeviceByIds([recId], "chat", {playerId: data.sender, message: data.message});

    },

    getPlayerForClientId: function (clientId) {
        var players = this.players.filter(function (pl) {
            if (typeof pl == "undefined") return false;
            if (pl.client == null) return false;
            return (pl.client.clientId == clientId);
        });
        return (players.length > 0) ? players[0] : null;
    },

    leaveGame: function (clientId) {
        var player = this.getPlayerForClientId(clientId);
        player.client = null;
        this.sendPlayerStatus();
    },

    requestJoin: function (clientId, msg) {
        var client = this.clients[clientId];
        var player;        //der player, der zu diesem client gehört.
        //schau mal, ob es einen player gibt, der über diesen client gespielt hat
        //wen ja, sende diesen player
        //wenn nicht, schaue, ob noch ein platz frei ist und vergebe ihn
        player = this.getPlayerForClientId(clientId);
        if (player == null) {
            //lege neuen player an, falls noch ein platz frei ist
            player = this.seatPlayer(client);
            if (player == null) {
                //kein freier platz!
                this.msgDeviceByIds([clientId], "status", {
                    player: {playerId: -1},
                    otherPlayers: this.getPlayerArray(),
                    maxPlayers: this.conf.playerCnt
                });
                return;
            } else {
                if (!!this.lastPlayerMessage) client.socket.send(JSON.stringify({
                    type: "display",
                    data: this.lastPlayerMessage
                }));
            }
        }
        this.sendPlayerStatus();
        //this.msgDevicesByRole('player', 'rates', {avgRating: this.avgRating});
    },

    sendPlayerStatus: function () {
        var self = this;
        var playerClients = this.clients.filter(function (cl) {
            return (cl.role == "player");
        });
        playerClients.forEach(function (cl) {
            var pl = self.getPlayerForClientId(cl.clientId);
            if (pl == null) pl = {playerId: -1};
            if (cl.connected) cl.socket.send(JSON.stringify({
                type: "status",
                data: {
                    player: {playerId: pl.playerId, colors: pl.colors},
                    otherPlayers: self.getPlayerArray(),
                    maxPlayers: self.conf.playerCnt
                }
            }));
        })
    },

    getPlayerArray: function () {
        var ret = [];
        this.players.forEach(function (pl) {
            if (typeof pl != "undefined") ret.push({playerId: pl.playerId, colors: pl.colors});
            else ret.push({playerId: -1, colors: ["weiss", "weiss"]});
        });
        return ret;
    },

    seatPlayer: function (client) {
        //find available playerId:
        //1. look for empty players
        //2. check if there are unseated players (client == null)
        //3. check if there are disconnected players
        var player = null;
        var playerId = -1;
        for (var i = this.conf.playerCnt - 1; i >= 0; i--) {
            if (typeof this.players[i] == 'undefined') playerId = i;
            else if (this.players[i].client == null) playerId = i;
        }
        if (playerId == -1) {
            for (var i = this.conf.playerCnt - 1; i >= 0; i--) {
                if (typeof this.players[i] != 'undefined') {
                    if (this.players[i].client == null) playerId = i;
                }
            }
        }
        if (playerId == -1) {
            for (var i = this.conf.playerCnt - 1; i >= 0; i--) {
                if (typeof this.players[i] != 'undefined') {
                    if (!this.players[i].client.connected) playerId = i;
                }
            }
        }
        if (playerId != -1 && playerId < 16) {
            player = {
                client: client,
                clientId: client.clientId,
                playerId: playerId,
                colors: this.colors[playerId]
            };
            this.players[playerId] = player;
        }
        return player;
    },

    rate: function (clientId, data) {
        var playerId = data.playerId;
        var rate = data.rate;
        this.rating[playerId] = rate;
        console.log("rate: " + this.rating);
        this.calcAvgRate();
        this.msgDevicesByRole('player', 'rates', {avgRating: this.avgRating});
    },

    calcAvgRate: function () {
        if (this.conf.playerCnt <= 1) {
            this.avgRating[0] = 4;
            return;
        }
        var sum;
        for (var j = 0; j < this.rating.length; j++) {
            sum = 0;
            for (var i = 0; i < this.rating.length; i++) {
                if (i != j) sum += this.rating[i][j];
            }
            this.avgRating[j] = Math.round(sum / (this.conf.playerCnt - 1));
        }
    }




};

module.exports = new PlayerManager();