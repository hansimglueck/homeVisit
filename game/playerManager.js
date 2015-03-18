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
    };
    this.europeCountries = [{"id":"pt", en:"Portugal", de:"Portugal", "class":"eu europe"},{"id":"es", en:"Spain", de:"Spanien", "class":"eu europe"},{"id":"be", en:"Belgium", de:"Belgien", "class":"eu europe"},{"id":"it", en:"Italy", de:"Italien", "class":"eu europe"},{"id":"pl", en:"Poland", de:"Polen", "class":"eu europe"},{"id":"fi", en:"Finlandia", de:"Finnland", "class":"eu europe"},{"id":"de", en:"Germany", de: "Deutschland", "class":"eu europe"},{"id":"se", en:"Sweden", de:"Schweden", "class":"eu europe"},{"id":"cy", en:"Cyprus", de:"Zypern", "class":"eu europe"},{"id":"ie", en:"Ireland", de:"Irland", "class":"eu europe"},{"id":"uk", en:"United Kingdom", de:"Vereinigtes Königreich", "class":"eu europe"},{"id":"at", en:"Austria", de:"Österreich", "class":"eu europe"},{"id":"cz", en:"Czech Republic", de:"Tschechien", "class":"eu europe"},{"id":"sk", en:"Slovakia", de:"Slowakei", "class":"eu europe"},{"id":"hu", en:"Hungary", de:"Ungarn", "class":"eu europe"},{"id":"lt", en:"Lithuania", de:"Litauen", "class":"eu europe"},{"id":"lv", en:"Latvia", de:"Lettland", "class":"eu europe"},{"id":"ro", en:"Romania", de:"Rumänien", "class":"eu europe"},{"id":"bg", en:"Bulgaria", de:"Bulgarien", "class":"eu europe"},{"id":"ee", en:"Estonia", de:"Estland", "class":"eu europe"},{"id":"lu", en:"Luxembourg", de:"Luxemburg", "class":"eu europe"},{"id":"fr", en:"France", de:"Frankreich", "class":"eu europe"},{"id":"nl", en:"Netherlands", de:"Niederlande", "class":"eu europe"},{"id":"si", en:"Slovenia", de:"Slowenien", "class":"eu europe"},{"id":"dk", en:"Denmark", de:"Dänemark", "class":"eu europe"},{"id":"mt", en:"Malta", de:"Malta", "class":"eu europe"},{"id":"hr", en:"Croatia", de:"Kroatien", "class":"eu europe"},{"id":"gr", en:"Greece", de:"Griechenland", "class":"eu europe"},{"id":"im", en:"", de:"", "class":"europe"},{"id":"is", en:"", de:"", "class":"europe"},{"id":"by", en:"", de:"", "class":"europe"},{"id":"no", en:"", de:"", "class":"europe"},{"id":"ua", en:"", de:"", "class":"europe"},{"id":"tr", en:"", de:"", "class":"europe"},{"id":"ch", en:"", de:"", "class":"europe"},{"id":"md", en:"", de:"", "class":"europe"},{"id":"al", en:"", de:"", "class":"europe"},{"id":"ad", en:"", de:"", "class":"europe"},{"id":"sm", en:"", de:"", "class":"europe"},{"id":"mc", en:"", de:"", "class":"europe"},{"id":"li", en:"", de:"", "class":"europe"},{"id":"ba", en:"", de:"", "class":"europe"},{"id":"mk", en:"", de:"", "class":"europe"},{"id":"va", en:"", de:"", "class":"europe"},{"id":"gl", en:"", de:"", "class":null},{"id":"ma", en:"", de:"", "class":null},{"id":"tn", en:"", de:"", "class":null},{"id":"dz", en:"", de:"", "class":null},{"id":"jo", en:"", de:"", "class":null},{"id":"tm", en:"", de:"", "class":null},{"id":"kz", en:"", de:"", "class":null},{"id":"il", en:"", de:"", "class":null},{"id":"sa", en:"", de:"", "class":null},{"id":"iq", en:"", de:"", "class":null},{"id":"az", en:"", de:"", "class":null},{"id":"ir", en:"", de:"", "class":null},{"id":"ge", en:"", de:"", "class":null},{"id":"sy", en:"", de:"", "class":null},{"id":"am", en:"", de:"", "class":null},{"id":"lb", en:"", de:"", "class":null},{"id":"ru-main", en:"", de:"", "class":null},{"id":"lakes", en:"", de:"", "class":null},{"id":"rs", en:"", de:"", "class":"cet"},{"id":"ru-kaliningrad", en:"", de:"", "class":"europe ru"},{"id":"me", en:"", de:"", "class":"cet"}];
    this.joinedPlayers = 0;
    this.voteItems = [];
    this.cardItems = [];
    this.directItems = [];
    this.resultItems = [];
};

PlayerManager.prototype = {
    init: function () {
        for (var i = 0; i < this.colors.length; i++) {
            this.players.push({
                clientId: -1,
                colors: this.colors[i],
                joined: false,
                seat: -1,
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
    masterMessage: function (clientId, msg) {
        if (msg.type == "register") {
            this.sendPlayerStatus(-1);
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

                case "results":
                    this.results(this.resultItems.push(item) - 1);
                    break;

                case "playerDirect":
                    this.direct(this.directItems.push(item) - 1);
                    break;

                default:
                    break;

            }
        } catch (e) {
            console.log("ERROR in playerManager.addItem! " + e.stack);
        }
    },
    direct: function(directId) {
        var directItem = this.directItems[directId];
        var self = this;
        directItem.voteOptions.forEach(function(opt, id){
            var recId = self.players[id].clientId;
            wsManager.msgDeviceByIds([recId], "display", {type: opt.value, text: opt.text});
        })
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
        voteItem.ratedVote = voteItem.flags ? voteItem.flags[0] : true;
        if (voteItem.options[0] == "playerChoice") {
            voteItem.voteOptions = this.getPlayerArray();
        }
        if (voteItem.options[0] == "countryChoice") {
            var lang = voteItem.options[1];
            voteItem.voteOptions = this.getEUcountries().map(function(c){return {val: c.id, text:c[lang]}});
        }
        var content = {
            voteId: voteId,
            type: voteItem.type,
            text: voteItem.text,
            voteOptions: voteItem.voteOptions,
            voteMulti: voteItem.voteMulti,
            ratedVote: voteItem.ratedVote,
            voteType: voteItem.options[0]
        };
        wsManager.msgDevicesByRole("player", "display", content);
    },
    getEUcountries: function() {
        return this.europeCountries.filter(function(c){
            return c.class == "eu europe";
        });
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
        if (this.players[playerId]) wsManager.msgDeviceByIds([this.players[playerId].clientId], "joined", {
            player: {
                playerId: playerId,
                joined: this.players[playerId].joined,
                colors: this.players[playerId].colors,
                seat: this.players[playerId].seat
            },
            rating: this.rating[playerId]
        });
        var msg = {
            otherPlayers: this.getPlayerArray(),
            maxPlayers: this.conf.playerCnt,
            avgRatings: this.avgRatings
        };
        wsManager.msgDevicesByRole("player", "status", msg);
        wsManager.msgDevicesByRole("master", "status", msg);
    },
    getPlayerArray: function () {
        var ret = [];
        for (var i = 0; i < this.players.length; i++) {
            ret.push({joined: this.players[i].joined, playerId: i, colors: this.players[i].colors, seat: this.players[i].seat});
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
            if (!dd[i].text) dd[i].text = dd[i].playerId;       //wenn das playerArray als VoteOPtions ausgegeben wurde
            if (dd[i].checked) msg += dd[i].text + " ";
        }
        voteItem.votes[playerId] = dd;
        voteItem.votes[playerId].multiplier = this.avgRatings[playerId];
        if (!voteItem.ratedVote) voteItem.votes[playerId].multiplier = 1;
        this.log("Player " + playerId + ": " + msg);
        console.log("multiplier=" + voteItem.votes[playerId].multiplier);
        wsManager.msgDeviceByIds([clientId], "display", {"text": msg});
        //voteComplete soll aufgerufen werden, wenn alle player mit joined = true gevoted haben...
        var missingVotes = 0;
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].joined) {
                if (typeof voteItem.votes[i] == "undefined") missingVotes++;
            }
        }
        if (missingVotes == 0) this.calcVoteAvg(voteId);
    },
    calcVoteAvg: function (voteId) {
        var voteItem = this.voteItems[voteId];
        var votes = voteItem.votes;
        var voteOptions = voteItem.voteOptions;
        voteItem.voteCount = 0;
        var bestOption = 0;
        for (var i = 0; i < votes.length; i++) {
            if (typeof votes[i] != "undefined") {
                for (var j = 0; j < voteOptions.length; j++) {
                    if (!voteOptions[j].result) voteOptions[j].result = 0;
                    if (!voteOptions[j].votes) voteOptions[j].votes = 0;
                    if (votes[i][j].checked) {
                        voteItem.voteCount += votes[i].multiplier;
                        voteOptions[j].result += votes[i].multiplier;
                        voteOptions[j].votes += 1;
                        if (voteOptions[j].result > voteOptions[bestOption].result) bestOption = j;
                    }
                }
            }
        }
        voteItem.maxCount = voteOptions[bestOption].result;
        voteOptions.sort(function (a, b) {
            return b.result - a.result
        });
        var game = require('./game.js');
        game.trigger(-1, {data: 'go'});
//        this.sendVoteResults(voteId);
    },
    results: function (resultId) {
        var newestVoteId = this.voteItems.length - 1;
        var resultItem = this.resultItems[resultId];
        switch (resultItem.text) {
            case 'seatOrder':
                this.findSeatOrder(newestVoteId);
                break;

            default:
                this.sendVoteResults(newestVoteId, resultItem);
                break;
        }
    },
    findSeatOrder: function (voteId) {

        var voteItem = this.voteItems[voteId];
        var problems = [];
        var self = this;

        function getCheckedPlayer(voteOptions) {
            return voteOptions.filter(function(voteOption, id) {
                voteOption.player = id;
                return voteOption.checked;
            }).map(function(voteOption) {
                return voteOption.player;
            })[0];
        }

        var answers = voteItem.votes.map(function(vote) {
            return getCheckedPlayer(vote);
        });
        var order = [];
        var next = 0;
        var ok = true;
        for (var i = 0; i < answers.length; i++) {
            if (order.indexOf(next) != -1) {
                ok = false;
                break;
            }
            order.push(next);
            this.players[i].seat = next;
            next = answers[next];
        }
        if (!ok) console.log("Answers are not yielding an Order!");
        this.sendPlayerStatus(-1);
        wsManager.msgDevicesByRole('player', "display", {
            type: "seatOrder"
         });
    },

    sendVoteResults: function (voteId, resultItem) {
        var displayType = resultItem.text;
        var voteItem = this.voteItems[voteId];
        var msg = voteItem.text;
        var labels = [];
        var resData = [];
        console.log("maxVoteCount="+voteItem.maxCount);
        voteItem.voteOptions.forEach(function (option) {
            labels.push(option.text + ": " + (option.result / voteItem.voteCount * 100).toFixed(1) + "% (" + option.votes + ")");
            if (displayType == "europeMap") resData.push({id: option.val , val: option.result / voteItem.maxCount * 100});
            else resData.push(option.result / voteItem.voteCount * 100);
        });
        wsManager.msgDevicesByRole('player', "display", {
            type: "result",
            displayType: displayType,
            text: msg,
            labels: labels,
            data: resData,
            resultColor: resultItem.options[0]
        });
    }
};

var playerManagerObj = new PlayerManager();
playerManagerObj.init();

module.exports = playerManagerObj;