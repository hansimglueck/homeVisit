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
    this.onTurn = 0;
    this.polls = {};
};

PlayerManager.prototype = {
    //erzeugt das player-array (inklusive inventory - dieses wird derzeit nicht mehr genutzt)
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
                ],
                away: false
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
    // und die player-aktions-funktionen
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
    // donation-msg-data: data.recipient (playerId), data.itemType
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
    chat: function (clientId, data) {
        var recId = this.players[data.recipient].clientId;
        this.sendMessage(data.recipient, "chat", {playerId: data.sender, message: data.message});

    },
    vote: function (clientId, data) {
        var playerId = data.playerId;
        var pollId = data.pollId;
        console.log("Got Vote for " + pollId + " from Player " + playerId);

        var poll = this.polls[pollId];
        if (typeof poll == "undefined") {
            this.sendMessage(playerId, "display", {"text": "This poll doesn't exist!"});
            return;
        }

        var choice = data.choice;
        var vote = {choice: choice, playerId: playerId};
        vote.multiplier = this.players.filter(function (p) { return p.joined; }).length - this.players[playerId].rank + 1;
//        vote.multiplier = this.avgRatings[playerId];

        poll.vote(vote);

        /*
        TODO: falls diese infos gesendet werden sollen, müssten dieses VOR poll.vote() ausgeführt werden.
        Das weitersteppen nach dem letzten vote überholt sonst diese nachricht
        var msg = "You voted: "+data.text;
        if (poll.isWeighted()) msg += " with a weight of "+vote.multiplier;
        this.log("Player " + playerId + ": " + msg);
        this.sendMessage(playerId, "display", {"text": msg});
         */
    },
    rate: function (clientId, data) {
        var playerId = data.playerId;
        var rate = data.rate;
        this.rating[playerId] = rate;
        console.log("rate: " + this.rating);
        this.calcAvgRate();
        this.broadcastMessage('rates', {avgRatings: this.avgRatings});
    },

    // callback-funktion für master-messages - bloss damit der master beim registrieren den status gesendet bekommen kann
    masterMessage: function (clientId, msg) {
        if (msg.type == "register") {
            this.sendPlayerStatus(-1);
        }
    },

    //callback für mc-messages. bei register wird status versendet, der MC kann auch punkte vergeben
    mcMessage: function (clientId, msg) {
        if (msg.type == "register") {
            this.sendPlayerStatus(-1);
        }
        if (msg.type == "score") {
            this.score(msg.data.playerId, msg.data.score);
        }
    },

    //wenn das game meint, die player sollten beschäftigt sein, ist das seine eingangstür
    addItem: function (item) {
        try {
            if (!item.type) {
                this.log("cannot process item (no type)!");
                return;
            }
            switch (item.type) {
                case "vote":
                    this.polls[item.poll.id] = item.poll;
                    item.poll.setMaxVotes(this.players.filter(function(player){return player.joined}).length);
                    this.deliverMessage(item.device, "display", item.poll.getWsContent());
                    break;
                case "card":
                    this.deliverMessage(item.device, "display", {type:item.type, text: item.text});
                    break;
                case "results":
                    this.results(item);
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
            //TODO: einen schönen weg finden, um solche Errors nach möglichkeit im admin-log zu zeigen
            console.log("ERROR in playerManager.addItem! " + e.stack);
        }
    },
    results: function (resultItem) {
        //console.log("preparing result " + resultId);
        //var newestVoteId = this.voteItems.length - 1;
        //var resultItem = this.resultItems[resultId];
        if (resultItem.opts) switch (resultItem.opts[1]) {
            case "optionScore":
                //this.calcScore("correct", newestVoteId);
                break;

            case "majorityScore":
                //this.calcScore("majority", newestVoteId);
                break;

            default:
                break;
        }
        switch (resultItem.text) {
            case 'seatOrder':
                this.findSeatOrder(newestVoteId);
                break;

            default:
                this.sendVoteResults(resultItem);
                break;
        }
    },
    sendVoteResults: function (resultItem) {
        var displayType = resultItem.resultType;
        var result = resultItem.data;
        var msg = result.text;
        var labels = [];
        var resData = [];
        var rightAnswer = [];
        if (result.voteOptions) rightAnswer = result.voteOptions.filter(function (a) {
            return (a.flags) ? a.flags[0] : false
        }).map(function (b) {
            return b.text
        });
        //"::::" erzeugt zwei Zeilenumbrüche in der Darstellung in der playerApp
        if (rightAnswer.length > 0) {
            if (typeof rightAnswer[0] != "undefined") msg += "::::" + "Right Answer: " + rightAnswer[0];
        }
        //console.log("maxVoteCount=" + voteItem.maxCount);
        if (resultType == "numberStats") {
            //send stats as array: [sum, avg]
            resData = [result.sum, result.average, result.minVal, result.maxVal];
        }
        else result.voteOptions.forEach(function (option) {
            labels.push(option.text + ": " + option.percent + "% (" + option.votes + ")");
            if (resultType == "europeMap") resData.push({
                id: option.value,
                val: option.percent
            });
            else resData.push(option.result);
        });
        //resultItem.data = resData;
        this.deliverMessage(resultItem.device, "display", {
            type: "result",
            resultType: resultType,
            text: msg,
            labels: labels,
            data: resData,
            resultColor: resultItem.opts ? resultItem.opts[0] : ""
        });
        /*
        if (!resultItem.flags[0]) return;
        var game = require('./game.js');
        game.trigger(-1, {data: 'go', param: result.voteOptions[0].id});
        */
    },
    direct: function (directId) {
        var directItem = this.directItems[directId];
        var self = this;
        directItem.voteOptions.forEach(function (opt, id) {
            self.sendMessage(id, "display", {type: opt.value, text: opt.text});
        })
    },
    eval: function (code) {
        console.log("Eval: " + code);
        eval(code);
    },
    //TODO: findSeatOrder ergibt noch keinen Sinn am ende - wird aber auch nicht verwendet ;)
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
        this.broadcastMessage("display", { type: "seatOrder"});
    },

    //schau mal, ob im ziel-device ein spezial steckt (zB player:next)
    //hier steckt auch die logik des weiterschaltens
    deliverMessage: function(device, type, content) {
        var specialPlayer = device.split(":")[1];
        if (typeof specialPlayer == "undefined") specialPlayer = "all";
        switch (specialPlayer) {
            case "next":
                // wir hoffen, dass die websocket-nachrichten in richtiger sequenz durchs netz flitzen....
                this.broadcastMessage("display", {type: "black"});
                this.advanceTurn(1);
                this.sendMessage(this.onTurn, type, content);
                break;
            case "all":
            default:
                this.broadcastMessage("display", content);
                break;
        }
    },
    // Zum Verteilen von allgemeinen ws-messages an alle Player.
    // diese funktion bemüht den wsManager und sichert die letzte Message zum Ausliefern bei Client-Reload
    broadcastMessage: function (type, data) {
        wsManager.msgDevicesByRole("player", type, data);
    },
    // Zum Benachrichtigen einzelner Player
    sendMessage: function (playerId, type, data) {
        wsManager.msgDeviceByIds([this.players[playerId].clientId], type, data);
    },

    sendInventory: function (playerId) {
        if (this.players[playerId]) this.sendMessage(playerId, "inventory", this.players[playerId].inventory);
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
    getPlayerIdForClientId: function (clientId) {
        var playerId = -1;
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].clientId == clientId) playerId = i;
        }
        return playerId;
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

    //der nächste ist dran...
    advanceTurn: function(x) {
        this.onTurn += x;
        this.onTurn %= this.players.length;
        if (!this.players[this.onTurn].joined || this.players[this.onTurn].away) {
            this.advanceTurn(1);
            return;
        }
        console.log("Now on turn: "+this.onTurn);
    },

    getCheckedVotes: function (voteId) {
        //soll ein array geben mit id=playerId und inhalt array of checked Item-ids
        return this.voteItems[voteId].votes.map(function (vote) {
            return vote.filter(function (opt, id) {
                opt.id = id;
                return opt.checked;
            }).map(function (v) {
                return v.id
            });
        });
    },
    getVoteNumbers: function (voteId) {
        return this.voteItems[voteId].votes.map(function (vote) {
            return vote.filter(function (opt, id) {
                return opt.checked;
            }).map(function (v) {
                return parseInt(v.val)
            });
        });
    },
    getResultStats: function (resultId) {
        return this.resultItems[resultId].data;
    }
};

var playerManagerObj = new PlayerManager();
playerManagerObj.init();

module.exports = playerManagerObj;