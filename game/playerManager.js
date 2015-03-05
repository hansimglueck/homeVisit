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
    this.avgRatings = [];
    this.conf = {
        playerCnt: 15
    }
    this.joinedPlayers = 0;
    this.voteItems = [];
    this.cardItems = [];

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
            this.avgRatings[i] = 4;
            for (var j = 0; j < this.colors.length; j++) {
                this.rating[i][j] = 4;
            }
        }
        //this.calcAvgRate();
        console.log();
    },

    log: function (message) {
        message = "PMANAGER: " + message;
        wsManager.msgDevicesByRole("master", "log", message);
    },

    playerMessage: function (clientId, msg) {
        try {
            if (typeof msg != "undefined") switch (msg.type) {
                case "joinGame":
                    this.requestJoin(clientId, msg.data);
                    break;

                case "leaveGame":
                    this.leaveGame(clientId);
                    break;

                case "vote":
                    this.vote(clientId, msg);
                    break;

                case "rate":
                    this.rate(clientId, msg.data);
                    break;

                case "chat":
                    this.chat(clientId, msg.data);
                    break;

                case "disconnected":
                    this.leaveGame(clientId);
                    break;

                default:
                    console.log("unknown message-type");
                    break;

            }
        } catch (e) {
            console.log("ERROR in playerManager.newMessage! " + e.stack);
        }
    },

    addItem: function (item) {
        try {
            if (!item.type) {
                this.log("cannot process item (no type)!");
                return;
            }

            switch (item.type) {
                case "vote":
                    this.sendVote(this.voteItems.push(item) - 1);
                    break;

                case "card":
                    //this.cardItems.push(item);
                    this.sendCard(this.cardItems.push(item) - 1);
                    break;

                default:
                    break;

            }
        } catch (e) {
            console.log("ERROR in playerManager.addItem! " + e.stack);
        }
    },

    sendCard: function (cardId) {
        var cardItem = this.cardItems[cardId];
        var content = {
            type: cardItem.type,
            text: cardItem.text
        };

        wsManager.msgDevicesByRole("player", "display", content);

    },

    sendVote: function (voteId) {
        var voteItem = this.voteItems[voteId];
        voteItem.votes = [];
        var content = {
            voteId: voteId,
            type: voteItem.type,
            text: voteItem.text,
            voteOptions: voteItem.voteOptions,
            voteMulti: voteItem.voteMulti,
            ratedVote: voteItem.ratedVote
        };
        wsManager.msgDevicesByRole("player", "display", content);
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
            maxPlayers: this.conf.playerCnt,
            playerRatings: this.rating[playerId],
            avgRatings: this.avgRatings
        };
        wsManager.msgDevicesByRole("player", "status", msg);
        wsManager.msgDevicesByRole("master", "status", msg);
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
    },

    rate: function (clientId, data) {
        var playerId = data.playerId;
        var rate = data.rate;
        this.rating[playerId] = rate;
        console.log("rate: " + this.rating);
        this.calcAvgRate();
        wsManager.msgDevicesByRole('player', 'rates', {avgRatings: this.avgRatings});
    },

    calcAvgRate: function () {
        if (this.conf.playerCnt <= 1) {
            this.avgRatings[0] = 4;
            return;
        }
        var sum, cnt;
        for (var j = 0; j < this.rating.length; j++) {
            sum = 0;
            cnt = 0;
            for (var i = 0; i < this.rating.length; i++) {
                if (i != j && this.players[i].joined) {
                    sum += this.rating[i][j];
                    cnt++;
                }
            }
            this.avgRatings[j] = Math.round(sum / cnt);
        }
    },

    vote: function (clientId, data) {
        //die eingehenden votes werden in einem objekt des aktuellen items gespeichert
        //if (content.type == "vote") this.getItem().votes = {};
        var playerId = data.playerId;
        var voteId = data.voteId;
        var voteItem = this.voteItems[voteId];
        console.log("Got Vote for " + voteId + " from Player " + playerId);
        var dd = data.data;
        if (this.voteItems.length == 0) {
            wsManager.msgDeviceByIds([clientId], "display", {"text": "There is no vote at the moment!"});
            return;
        }
        if (typeof voteItem == "undefined") {
            wsManager.msgDeviceByIds([clientId], "display", {"text": "This vote doesn't exist!"});
            return;
        }
        if (voteItem.votes[playerId]) {
            wsManager.msgDeviceByIds([clientId], "display", {"text": "You already voted in this Poll!"});
        }
        console.log("vote=" + dd);
        var msg = "You voted: ";
        for (var i = 0; i < dd.length; i++) {
            if (dd[i].checked) msg += dd[i].text + " ";
        }
        voteItem.votes[playerId] = dd;
        voteItem.votes[playerId].multiplier = this.avgRatings[playerId];
        if (!voteItem.ratedVote) voteItem.votes[playerId].multiplier = 1;
        this.log("Player " + playerId + ": " + msg);
        console.log("multiplier="+voteItem.votes[playerId].multiplier);
        wsManager.msgDeviceByIds([clientId], "display", {"text": msg});
        //voteComplete soll aufgerufen werden, wenn alle player mit joined = true gevoted haben...
        var missingVotes = 0;
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].joined) {
                if (typeof voteItem.votes[i] == "undefined") missingVotes++;
            }
        }
        if (missingVotes == 0) this.voteComplete(voteId);
    },

    voteComplete: function (voteId) {
        var voteItem = this.voteItems[voteId];
        var votes = voteItem.votes;
        var voteOptions = voteItem.voteOptions;
        var voteCount = 0;
        var bestOption = 0;
        for (var i = 0; i < votes.length; i++) {
            if (typeof votes[i] != "undefined") {
                for (var j = 0; j < voteOptions.length; j++) {
                    if (!voteOptions[j].result) voteOptions[j].result = 0;
                    if (!voteOptions[j].votes) voteOptions[j].votes = 0;
                    if (votes[i][j].checked) {
                        voteCount += votes[i].multiplier;
                        voteOptions[j].result += votes[i].multiplier;
                        voteOptions[j].votes += 1;
                        if (voteOptions[j].result > voteOptions[bestOption].result) bestOption = j;
                    }
                }

            }
        }
        voteOptions.sort(function (a, b) {
            return b.result - a.result
        });
        var msg = voteItem.text;
        var labels = [];
        var resData = [];
        voteItem.voteOptions.forEach(function (option) {
            //msg += option.text + ": " + (option.result / voteCount * 100).toFixed(1) + "% (" + option.result + "/" + voteCount + ")" + "::";
            labels.push(option.text + ": " + (option.result / voteCount * 100).toFixed(1) + "% (" + option.votes + ")");
            resData.push(option.result / voteCount * 100);
        });
        wsManager.msgDevicesByRole('player', "display", {type: "result", text: msg, labels: labels, data: resData});
    }


}
;
var playerManagerObj = new PlayerManager();
playerManagerObj.init();

module.exports = playerManagerObj;