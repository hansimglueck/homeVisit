var wsManager = require('./wsManager.js');


PlayerManager = function () {
    this.players = [];
    /*
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
     */
    this.colors = [
        ["pink", "schwarz"],
        ["gelb", "gruen"],
        ["rot", "blau"],
        ["gelb", "pink"],
        ["rot", "gruen"],
        ["blau", "pink"],
        ["rot", "gelb"],
        ["gelb", "blau"]
    ];

    this.rating = [];
    this.avgRatings = [];
    this.conf = {
        playerCnt: 8
    };
    this.europeCountries = [{"id": "pt", en: "Portugal", de: "Portugal", "class": "eu europe"}, {
        "id": "es",
        en: "Spain",
        de: "Spanien",
        "class": "eu europe"
    }, {"id": "be", en: "Belgium", de: "Belgien", "class": "eu europe"}, {
        "id": "it",
        en: "Italy",
        de: "Italien",
        "class": "eu europe"
    }, {"id": "pl", en: "Poland", de: "Polen", "class": "eu europe"}, {
        "id": "fi",
        en: "Finlandia",
        de: "Finnland",
        "class": "eu europe"
    }, {"id": "de", en: "Germany", de: "Deutschland", "class": "eu europe"}, {
        "id": "se",
        en: "Sweden",
        de: "Schweden",
        "class": "eu europe"
    }, {"id": "cy", en: "Cyprus", de: "Zypern", "class": "eu europe"}, {
        "id": "ie",
        en: "Ireland",
        de: "Irland",
        "class": "eu europe"
    }, {"id": "uk", en: "United Kingdom", de: "Vereinigtes Königreich", "class": "eu europe"}, {
        "id": "at",
        en: "Austria",
        de: "Österreich",
        "class": "eu europe"
    }, {"id": "cz", en: "Czech Republic", de: "Tschechien", "class": "eu europe"}, {
        "id": "sk",
        en: "Slovakia",
        de: "Slowakei",
        "class": "eu europe"
    }, {"id": "hu", en: "Hungary", de: "Ungarn", "class": "eu europe"}, {
        "id": "lt",
        en: "Lithuania",
        de: "Litauen",
        "class": "eu europe"
    }, {"id": "lv", en: "Latvia", de: "Lettland", "class": "eu europe"}, {
        "id": "ro",
        en: "Romania",
        de: "Rumänien",
        "class": "eu europe"
    }, {"id": "bg", en: "Bulgaria", de: "Bulgarien", "class": "eu europe"}, {
        "id": "ee",
        en: "Estonia",
        de: "Estland",
        "class": "eu europe"
    }, {"id": "lu", en: "Luxembourg", de: "Luxemburg", "class": "eu europe"}, {
        "id": "fr",
        en: "France",
        de: "Frankreich",
        "class": "eu europe"
    }, {"id": "nl", en: "Netherlands", de: "Niederlande", "class": "eu europe"}, {
        "id": "si",
        en: "Slovenia",
        de: "Slowenien",
        "class": "eu europe"
    }, {"id": "dk", en: "Denmark", de: "Dänemark", "class": "eu europe"}, {
        "id": "mt",
        en: "Malta",
        de: "Malta",
        "class": "eu europe"
    }, {"id": "hr", en: "Croatia", de: "Kroatien", "class": "eu europe"}, {
        "id": "gr",
        en: "Greece",
        de: "Griechenland",
        "class": "eu europe"
    }, {"id": "im", en: "", de: "", "class": "europe"}, {"id": "is", en: "", de: "", "class": "europe"}, {
        "id": "by",
        en: "",
        de: "",
        "class": "europe"
    }, {"id": "no", en: "", de: "", "class": "europe"}, {"id": "ua", en: "", de: "", "class": "europe"}, {
        "id": "tr",
        en: "",
        de: "",
        "class": "europe"
    }, {"id": "ch", en: "", de: "", "class": "europe"}, {"id": "md", en: "", de: "", "class": "europe"}, {
        "id": "al",
        en: "",
        de: "",
        "class": "europe"
    }, {"id": "ad", en: "", de: "", "class": "europe"}, {"id": "sm", en: "", de: "", "class": "europe"}, {
        "id": "mc",
        en: "",
        de: "",
        "class": "europe"
    }, {"id": "li", en: "", de: "", "class": "europe"}, {"id": "ba", en: "", de: "", "class": "europe"}, {
        "id": "mk",
        en: "",
        de: "",
        "class": "europe"
    }, {"id": "va", en: "", de: "", "class": "europe"}, {"id": "gl", en: "", de: "", "class": null}, {
        "id": "ma",
        en: "",
        de: "",
        "class": null
    }, {"id": "tn", en: "", de: "", "class": null}, {"id": "dz", en: "", de: "", "class": null}, {
        "id": "jo",
        en: "",
        de: "",
        "class": null
    }, {"id": "tm", en: "", de: "", "class": null}, {"id": "kz", en: "", de: "", "class": null}, {
        "id": "il",
        en: "",
        de: "",
        "class": null
    }, {"id": "sa", en: "", de: "", "class": null}, {"id": "iq", en: "", de: "", "class": null}, {
        "id": "az",
        en: "",
        de: "",
        "class": null
    }, {"id": "ir", en: "", de: "", "class": null}, {"id": "ge", en: "", de: "", "class": null}, {
        "id": "sy",
        en: "",
        de: "",
        "class": null
    }, {"id": "am", en: "", de: "", "class": null}, {"id": "lb", en: "", de: "", "class": null}, {
        "id": "ru-main",
        en: "",
        de: "",
        "class": null
    }, {"id": "lakes", en: "", de: "", "class": null}, {
        "id": "rs",
        en: "",
        de: "",
        "class": "cet"
    }, {"id": "ru-kaliningrad", en: "", de: "", "class": "europe ru"}, {"id": "me", en: "", de: "", "class": "cet"}];
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
                seat: this.players.length,
                score: 0,
                rank: -1,
                timeScore: 0,
                timeRank: -1,
                inventory: [
                    {type: 0, name: "plus"},
                    {type: 0, name: "plus"},
                    {type: 0, name: "plus"},
                    {type: 0, name: "plus"},
                    {type: 0, name: "plus"},
                    {type: 1, name: "minus"},
                    {type: 1, name: "minus"},
                    {type: 1, name: "minus"},
                    {type: 1, name: "minus"},
                    {type: 1, name: "minus"}
                ]
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
    // callback-funktion für alle eingehenden role=player-nachrichten
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

                case "donation":
                    this.donate(clientId, msg);
                    break;

                default:
                    console.log("unknown message-type");
                    break;

            }
        } catch (e) {
            console.log("ERROR in playerManager.newMessage! " + e.stack);
        }
    },
    // Zum Verteilen von allgemeinen Szenen an alle Player.
    // diese funktion bemüht den wsManager und sichert die letzte Message zum Ausliefern bei Client-Reload
    broadcastMessage: function(type, data) {
        wsManager.msgDevicesByRole("player", type, data);
    },
    // Zum Benachrichtigen einzelner Player
    sendMessage: function(playerId, type, data){
        wsManager.msgDeviceByIds([this.players[playerId].clientId], type, data);
    },
    //donation-msg-data: data.recipient (playerId), data.itemType
    donate: function (clientId, data) {
        var playerId = this.getPlayerIdForClientId(clientId);
        console.log("Donation-Action from " + playerId + ": giving item" + data.itemId + " to " + data.recipient);
        var items = this.players[playerId].inventory.filter(function (item, id) {
            item.id = id;
            return item.type == data.itemId
        });
        var count = items.length;
        if (count <= 0) {
            console.log("not in stock!!!");
            return;
        }
        count--;
        this.players[playerId].inventory.splice(items[0].id, 1);
        switch (parseInt(data.itemId)) {
            case 0:
                this.players[data.recipient].score += 1;
                break;
            case 1:
                this.players[data.recipient].score -= 1;
                break;
            default:
                console.log("unknown inventory item");
                break;
        }
        this.sendInventory(playerId);
        this.sendPlayerStatus(-1);

    },
    sendInventory: function (playerId) {
        if (this.players[playerId]) this.sendMessage(playerId, "inventory", this.players[playerId].inventory);
    },
    masterMessage: function (clientId, msg) {
        if (msg.type == "register") {
            this.sendPlayerStatus(-1);
        }
    },
    mcMessage: function (clientId, msg) {
        if (msg.type == "register") {
            this.sendPlayerStatus(-1);
        }
        if (msg.type == "score") {
            this.score(msg.data.playerId,msg.data.score);
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

                case "eval":
                    this.eval(item.text);
                    break;

                default:
                    break;

            }
        } catch (e) {
            console.log("ERROR in playerManager.addItem! " + e.stack);
        }
    },
    direct: function (directId) {
        var directItem = this.directItems[directId];
        var self = this;
        directItem.voteOptions.forEach(function (opt, id) {
            self.sendMessage(id, "display", {type: opt.value, text: opt.text});
        })
    },
    sendCard: function (cardId) {
        var cardItem = this.cardItems[cardId];
        var content = {
            type: cardItem.type,
            text: cardItem.text
        };
        this.broadcastMessage("display", content);
    },
    sendVote: function (voteId) {
        var voteItem = this.voteItems[voteId];
        voteItem.votes = [];
        voteItem.ratedVote = voteItem.flags ? voteItem.flags[0] : true;
        if (voteItem.opts[0] == "playerChoice") {
            voteItem.voteOptions = this.getPlayerArray();
        }
        if (voteItem.opts[0] == "enterNumber") {
            voteItem.voteOptions = [{val: 0, checked: false}];
        }
        if (voteItem.opts[0] == "countryChoice") {
            var lang = voteItem.opts[1];
            voteItem.voteOptions = this.getEUcountries().map(function (c) {
                return {val: c.id, text: c[lang]}
            });
        }
        var content = {
            voteId: voteId,
            type: voteItem.type,
            text: voteItem.text,
            voteOptions: voteItem.voteOptions,
            voteMulti: voteItem.voteMulti,
            ratedVote: voteItem.ratedVote,
            voteType: voteItem.opts[0]
        };
        this.broadcastMessage("display", content);
    },
    getEUcountries: function () {
        return this.europeCountries.filter(function (c) {
            return c.class == "eu europe";
        });
    },
    chat: function (clientId, data) {
        var recId = this.players[data.recipient].clientId;
        this.sendMessage(data.recipient, "chat", {playerId: data.sender, message: data.message});

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
        if (this.players[playerId]) {
            this.sendMessage(playerId, "joined", {
                player: {
                    playerId: playerId,
                    joined: this.players[playerId].joined,
                    colors: this.players[playerId].colors,
                    seat: this.players[playerId].seat,
                    score: this.players[playerId].score,
                    rank: this.players[playerId].rank
                },
                rating: this.rating[playerId]
            });
            this.sendInventory(playerId);
        }
        this.calcRanking();
        var msg = {
            otherPlayers: this.getPlayerArray(),
            maxPlayers: this.conf.playerCnt,
            avgRatings: this.avgRatings
        };
        this.broadcastMessage("status", msg);
        wsManager.msgDevicesByRole("master", "status", msg);
        wsManager.msgDevicesByRole("MC", "status", msg);
    },
    calcRanking: function () {
        var self = this;
        var ranking = this.players.map(function (p, id) {
            return {playerId: id, score: (p.joined ? p.score : -1000)}
        }).sort(function (a, b) {
            return b.score - a.score;
        });
        ranking.forEach(function (rank, id) {
            self.players[rank.playerId].rank = id + 1;
        });
    },
    getPlayerArray: function () {
        var ret = [];
        for (var i = 0; i < this.players.length; i++) {
            ret.push({
                joined: this.players[i].joined,
                playerId: i,
                colors: this.players[i].colors,
                seat: this.players[i].seat,
                score: this.players[i].score,
                rank: this.players[i].rank,
                timeRank: this.players[i].timeRank
            });
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
        this.broadcastMessage('rates', {avgRatings: this.avgRatings});
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
            this.sendMessage(playerId, "display", {"text": "There is no vote at the moment!"});
            return;
        }
        if (typeof voteItem == "undefined") {
            this.sendMessage(playerId, "display", {"text": "This vote doesn't exist!"});
            return;
        }
        if (voteItem.votes[playerId]) {
            this.sendMessage(playerId, "display", {"text": "You already voted in this Poll!"});
        }
        console.log("vote=" + dd);
        var msg = "You voted: ";
        for (var i = 0; i < dd.length; i++) {
            if (typeof dd[i].text == "undefined") dd[i].text = dd[i].playerId;       //wenn das playerArray als VoteOPtions ausgegeben wurde
            if (dd[i].checked) msg += dd[i].text + " ";
        }
        voteItem.votes[playerId] = dd;
        if (typeof voteItem.multiplier == "undefined") voteItem.multiplier = [];
        voteItem.multiplier[playerId] = this.players.filter(function (p) {
            return p.joined
        }).length - this.players[playerId].rank + 1;
//        voteItem.votes[playerId].multiplier = this.avgRatings[playerId];
        if (!voteItem.ratedVote) voteItem.multiplier[playerId] = 1;
        this.log("Player " + playerId + ": " + msg);
        console.log("multiplier=" + voteItem.multiplier[playerId]);
        this.sendMessage(playerId, "display", {"text": msg});
        //voteComplete soll aufgerufen werden, wenn alle player mit joined = true gevoted haben...
        var missingVotes = 0;
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].joined) {
                if (typeof voteItem.votes[i] == "undefined") missingVotes++;
            }
        }
        if (missingVotes == 0) this.calcVoteAvg(voteId);
    },

    //wird aufgerufen, sobald alle player gevoted haben - führt am ende GO aus
    calcVoteAvg: function (voteId) {
        var voteItem = this.voteItems[voteId];
        var votes = voteItem.votes;
        var voteOptions = voteItem.voteOptions;
        voteItem.voteCount = 0;
        var bestOption = 0;
        //TODO: besserer check nach minVal/maxVal
        voteItem.minVal = 1000000;
        voteItem.maxVal = 0;
        for (var i = 0; i < votes.length; i++) {
            if (typeof votes[i] != "undefined") {
                for (var j = 0; j < voteOptions.length; j++) {
                    if (!voteOptions[j].result) voteOptions[j].result = 0;
                    if (!voteOptions[j].votes) voteOptions[j].votes = 0;
                    if (votes[i][j].checked) {
                        voteItem.voteCount += voteItem.multiplier[i]; //votes[i].multiplier;
                        if (voteItem.opts[0] == "enterNumber") {
                            voteOptions[j].result += parseFloat(votes[i][j].val);
                            if (parseFloat(votes[i][j].val) < voteItem.minVal) voteItem.minVal = parseFloat(votes[i][j].val);
                            if (parseFloat(votes[i][j].val) > voteItem.maxVal) voteItem.maxVal = parseFloat(votes[i][j].val);
                        }
                        else {
                            voteOptions[j].result += voteItem.multiplier[i];
                            if (voteOptions[j].result > voteOptions[bestOption].result) bestOption = j;
                        }
                        voteOptions[j].votes += 1;
                    }
                }
            }
        }
        voteItem.maxCount = voteOptions[bestOption].result;
        voteItem.bestOption = bestOption;
        voteOptions.sort(function (a, b) {
            return b.result - a.result
        });
        var game = require('./game.js');
        game.trigger(-1, {data: 'go'});
//        this.sendVoteResults(voteId);
    },

    //
    results: function (resultId) {
        console.log("preparing result " + resultId);
        var newestVoteId = this.voteItems.length - 1;
        var resultItem = this.resultItems[resultId];
        switch (resultItem.opts[1]) {
            case "optionScore":
                this.calcScore("correct", newestVoteId);
                break;

            case "majorityScore":
                this.calcScore("majority", newestVoteId);
                break;

            default:
                break;
        }
        switch (resultItem.text) {
            case 'seatOrder':
                this.findSeatOrder(newestVoteId);
                break;

            default:
                this.sendVoteResults(newestVoteId, resultItem);
                break;
        }
    },

    calcScore: function (type, voteId) {
        var voteItem = this.voteItems[voteId];
        var voteOptions = voteItem.voteOptions;
        var self = this;
        voteItem.votes.forEach(function (vote, id) {
            var score = 0;
            vote.filter(function (opt, id) {
                opt.id = id;
                return opt.checked;
            })
                .forEach(function (checked) {
                    if (type == "correct") {
                        if (checked.flags[0]) score++;
                        else score--;
                    } else if (type == "majority") {
                        if (checked.id == voteItem.bestOption) score++;
                        else score--;
                    }
                });
            self.players[id].score += score;
        });
        this.sendPlayerStatus(-1);
    },
    score: function (playerId, score) {
        this.players[playerId].score += score;
        this.sendPlayerStatus(-1);
    },
    findSeatOrder: function (voteId) {

        var voteItem = this.voteItems[voteId];
        var problems = [];
        var self = this;

        function getCheckedPlayer(voteOptions) {
            return voteOptions.filter(function (voteOption, id) {
                voteOption.player = id;
                return voteOption.checked;
            }).map(function (voteOption) {
                return voteOption.player;
            })[0];
        }

        var answers = voteItem.votes.map(function (vote) {
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
        this.broadcastMessage("display", {
            type: "seatOrder"
        });
    },

    sendVoteResults: function (voteId, resultItem) {
        var displayType = resultItem.text;
        var voteItem = this.voteItems[voteId];
        var msg = voteItem.text;
        var labels = [];
        var resData = [];
        var rightAnswer = voteItem.voteOptions.filter(function (a) {
            return (a.flags) ? a.flags[0] : false
        }).map(function (b) {
            return b.text
        });
        if (rightAnswer.length > 0) {
            if (typeof rightAnswer[0] != "undefined") msg += "::::" + "Right Answer: " + rightAnswer[0];
        }
        console.log("maxVoteCount=" + voteItem.maxCount);
        if (displayType == "numberStats") {
            //send stats as array: [sum, avg]
            resData = [voteItem.voteOptions[0].result, voteItem.voteOptions[0].result / voteItem.voteCount, voteItem.minVal, voteItem.maxVal];
        }
        else voteItem.voteOptions.forEach(function (option) {
            labels.push(option.text + ": " + (option.result / voteItem.voteCount * 100).toFixed(1) + "% (" + option.votes + ")");
            if (displayType == "europeMap") resData.push({
                id: option.val,
                val: option.result / voteItem.maxCount * 100
            });
            else resData.push(option.result / voteItem.voteCount * 100);
        });
        resultItem.data = resData;
        this.broadcastMessage("display", {
            type: "result",
            displayType: displayType,
            text: msg,
            labels: labels,
            data: resData,
            resultColor: resultItem.opts[0]
        });
        if (!resultItem.flags[0]) return;
        var game = require('./game.js');
        game.trigger(-1, {data: 'go', param: voteItem.bestOption});
    },

    eval: function (code) {
        console.log("Eval: " + code);
        eval(code);
    },
    getCheckedVotes: function (voteId) {
        //soll ein array geben mit id=playerId und inhalt array of checked Item-ids
        return this.voteItems[voteId].votes.map(function(vote){
            return vote.filter(function(opt,id){
                opt.id = id;
                return opt.checked;
            }).map(function(v){return v.id});
        });
    },
    getVoteNumbers: function(voteId) {
        return this.voteItems[voteId].votes.map(function(vote){
            return vote.filter(function(opt,id){
                return opt.checked;
            }).map(function(v){return parseInt(v.val)});
        });
    },
    getResultStats: function(resultId) {
        return this.resultItems[resultId].data;
    }
};

var playerManagerObj = new PlayerManager();
playerManagerObj.init();

module.exports = playerManagerObj;
