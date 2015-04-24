var wsManager = require('./wsManager.js');
var gameConf = require('./gameConf');


PlayerManager = function () {
    this.players = [];
    this.rating = [];
    this.avgRatings = [];
    this.voteItems = [];
    this.directItems = [];
    this.resultItems = [];
    this.onTurn = 0;
    this.upcoming = 1;
    this.polls = {};
    this.deals = {};
    this.relations = {};
};

PlayerManager.prototype = {
    //erzeugt das player-array (inklusive inventory - dieses wird derzeit nicht mehr genutzt)
    init: function () {
        for (var i = 0; i < gameConf.maxPlayerCnt; i++) {
            this.players.push({
                playerId: i,
                clientId: -1,
                joined: false,
                busy: false,
                seat: this.players.length,
                score: 0,
                rank: -1,
                timeScore: 0,
                timeRank: -1,
                deals: {},
                inventory: [],
                away: false,
                selected: false
            });
            this.rating[i] = [];
            this.avgRatings[i] = 4;
            for (var j = 0; j < gameConf.maxPlayerCnt; j++) {
                this.rating[i][j] = 4;
            }
        }
        //this.calcAvgRate();
        console.log();
    },
    resetPlayers: function() {
        this.deals = {};
        this.relations = {};
        this.players.forEach(function(player){
            player.score = 0;
            player.rank = -1;
            player.selcted = false;
            player.away = false;
            player.deals = {};
            player.busy = false;
        });
        this.sendPlayerStatus(-1);
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
                    this.vote(clientId, msg.data);
                    break;

                case "rate":
                    this.rate(clientId, msg.data);
                    break;

                case "chat":
                    this.chat(clientId, msg.data);
                    break;

                case "deal":
                    this.deal(clientId, msg.data);
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

        this.players[playerId].clientId = clientId;
        this.players[playerId].joined = true;
        this.sendPlayerStatus(playerId);
        if (!!this.players[playerId].lastDisplayMessage) wsManager.msgDeviceByIds([clientId], "display", this.players[playerId].lastDisplayMessage);
        //this.msgDevicesByRole('player', 'rates', {avgRating: this.avgRating});
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
        data.multiplier = this.players.filter(function (p) {
            return p.joined;
        }).length - this.players[playerId].rank + 1;
//        vote.multiplier = this.avgRatings[playerId];

        poll.vote(data);

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
    //deals werden immer komplett versendet mit unique .id
    //wenn es den deal noch nicht gibt im deal-array, dann füge ihn ein, sonst update ihn.
    //je nach state an .playerId0 oder .playerId1 schicken
    deal: function (clientId, deal) {
        this.deals[deal.id] = deal;
        this.players[deal.player0Id].deals[deal.id] = deal;
        this.players[deal.player1Id].deals[deal.id] = deal;
        switch (deal.state) {
            case 1:
                this.sendMessage(deal.player1Id, "deal", deal);
                this.players[deal.player0Id].busy = true;
                this.players[deal.player1Id].busy = true;
                break;
            case 2:
                this.sendMessage(deal.player0Id, "deal", deal);
                this.players[deal.player0Id].busy = true;
                this.players[deal.player1Id].busy = true;
                break;
            case 3:
                var value = deal.messages[deal.messages.length-2].value;
                this.score(deal.player0Id, -value, deal.subject);
                this.score(deal.player1Id, value, deal.subject);
                this.sendMessage(deal.player0Id, "deal", deal);
                this.sendMessage(deal.player1Id, "deal", deal);
                this.sendGameEvent(deal.player0Id, deal.subject, deal.player1Id, "");
                this.sendGameEvent(deal.player1Id, deal.subject, deal.player0Id, "");
                this.players[deal.player0Id].busy = true;
                this.players[deal.player1Id].busy = true;
                break;
            default:
                this.sendMessage(deal.player0Id, "deal", deal);
                this.sendMessage(deal.player1Id, "deal", deal);
                this.players[deal.player0Id].busy = false;
                this.players[deal.player1Id].busy = false;
                break;
        }
        this.sendPlayerStatus(-1);
    },

    //TODO: subscribeStatus oder so ausdenken um berücksichtigt zu werden, immer wenn playerStatus neu gesendet wird
    requestStatus: function (clientId, role, msg) {
        if (role !== "MC" && role !== "master") return;
        if (msg.type == "register") {
            this.sendPlayerStatus(-1);
        }
    },

    //callback für mc-messages. bei register wird status versendet, der MC kann auch punkte vergeben
    scoreMessage: function (clientId, role, msg) {
        if (msg.type == "score") {
            this.score(msg.data.playerId, msg.data.score, "MC");

        }
    },

    setStatusMessage: function (clientId, role, msg) {
        var data = msg.data;
        try {
            console.log(data);
            if (typeof data != "undefined") switch (data.cmd) {
                //case "score":
                //        this.score(data, data.id, data.value);
                //    break;
                case "toggleSelected":
                    this.players[data.id].selected ^= true;
                    console.log("Set Player #: " + data.id + " .selected = " + this.players[data.id].selected);
                    break;
                case "toggleAway":
                    this.players[data.id].away ^= true;
                    console.log("Set Player #: " + data.id + " .away = " + this.players[data.id].away);
                    break;
                case "setUpcoming":
                    this.setUpcoming(data.id);
                    console.log("Set Player #: " + data.id + " as upcoming");
                    break;
                case "setAct":
                    console.log("Set Player #: " + data.id + " as active");
                    break;
                default:
                    console.log("unknown message-type");
                    break;
            }
        } catch (e) {
            console.log("ERROR in playerManager.newMessage! " + e.stack);
        }
        this.sendPlayerStatus(-1);
    },

    //wenn das game meint, die player sollten beschäftigt sein, ist das seine eingangstür
    addItem: function (item, device) {
        var self = this;
        try {
            if (!item.type) {
                this.log("cannot process item (no type)!");
                return;
            }
            switch (item.type) {
                case "vote":
                    this.polls[item.poll.id] = item.poll;
                    item.poll.setMaxVotes(this.players.filter(function (player) {
                        return player.joined
                    }).length);
                    this.deliverMessage(device, "display", item.getWsContent());
                    break;
                case "card":
                    this.deliverMessage(device, "display", item.getWsContent());
                    break;
                case "results":
                    this.deliverMessage(device, "display", item.getWsContent());
                    //this.results(item);
                    break;
                case "playerDirect":
                    this.direct(this.directItems.push(item) - 1);
                    break;
                case "eval":
                    this.eval(item.text);
                    break;
                case "rating":
                    console.log('->RATING<- ', device, item.getWsContent());
                    this.deliverMessage(device, "display", item.getWsContent());
                    break;
                case "deal":
                    this.deliverMessage(device, "display", item.getWsContent());
                    break;
                case "agreement":
                    this.polls[item.poll.id] = item.poll;
                    item.playerIds.forEach(function (id) {
                        self.sendMessage(id, "display", item.getWsContent());
                    });
                    break;
                case "roulette":
                    this.polls[item.poll.id] = item.poll;
                    item.playerIds.forEach(function (id) {
                        self.sendMessage(id, "display", item.getWsContent());
                    });
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
        var resultType = resultItem.resultType;
        var result = resultItem.data;
        var msg = result.text;
        var labels = [];
        var resData = [];
        //"::::" erzeugt zwei Zeilenumbrüche in der Darstellung in der playerApp
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
    },
    direct: function (directId) {
        var directItem = this.directItems[directId];
        var self = this;
        directItem.voteOptions.forEach(function (opt, id) {
            self.sendMessage(id, "display", {type: opt.value, text: opt.text});
        })
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
        this.broadcastMessage("display", {type: "seatOrder"});
    },

    playRoulette: function (result) {
        console.log("play roulette");
        var self = this;
        self.broadcastMessage("display", {type: "card", text: "You are NOT in the game!"});
        console.log(result.positivePlayerIds);
        if (result.positivePlayerIds.length == 0) return;
        result.positivePlayerIds.forEach(function(playerId){
            self.sendMessage(playerId, "display", {type: "card", text: "You are in the game!"});
        });
        var self = this;
        var steps = Math.floor(Math.random() * result.positivePlayerIds.length) + 23;

        this.rouletteStep(steps, result, function(item, winner) {self.finishRoulette(item, winner)});

    },

    rouletteStep: function (steps, item, cb) {
        var cnt = item.positivePlayerIds.length;
        var turn = item.positivePlayerIds[steps%cnt];
        var self = this;
        console.log("step "+steps+ "turn="+turn);
        if (steps == 0) cb.call(self, item, turn);
        else setTimeout(function () {
            self.sendMessage(turn, "fx", {type: "flashAndSound", color: "#ff0000", sound: "zip", time: 500});
            self.rouletteStep(steps-1, item, cb);
        }, Math.pow(((35 - steps) * 30),2)/1000)
    },

    finishRoulette: function(item, winner) {
        console.log("and the winner is: "+winner);
        this.sendMessage(winner, "fx", {type: "flashAndSound", color: "green", sound: "win", time: 2000});
        var self = this;
        item.positivePlayerIds.forEach(function(player){
            if (player === winner) self.score(player, item.win, "roulette");
            else self.score(player, -item.cost, "roulette");
        })
    },

    //schau mal, ob im ziel-device ein spezial steckt (zB player:next)
    //hier steckt auch die logik des weiterschaltens
    deliverMessage: function (device, type, content) {
        var specialPlayer = device.split(":")[1];
        var self = this;
        if (typeof specialPlayer == "undefined") specialPlayer = "all";
        if (specialPlayer === "next") {
            this.broadcastMessage("display", {type:"black"});
            if (this.upcoming === this.onTurn + 1 || this.upcoming === -1) {
                this.advanceTurn(1);
            } else {
                this.advanceTurnTo(this.upcoming);
            }
            specialPlayer = "act";
        }
        var players = this.getPlayerGroup(specialPlayer);
        //                this.broadcastMessage(type, {type: "black"});

        players.forEach(function (player) {
            self.sendMessage(player.playerId, type, content);
        });
    },

    getPlayerGroup: function (identifier) {
        console.log("getPlayerGroup " + identifier);
        var ret;
        var self = this;
        var inverse = false;
        if (typeof identifier === 'undefined') return;
        if (identifier.indexOf("!") === 0) {
            inverse = true;
            identifier = identifier.substring(1);
        }
        switch (identifier) {
            case "act":
            case "active":
                ret = this.players.filter(function (player) {
                    return (player.seat === self.onTurn) ^ inverse;
                });
                break;
            case "sel":
            case "selected":
                ret = this.players.filter(function (player) {
                    return player.selected ^ inverse;
                });
                break;
            case "topTwo":
                ret = this.players.filter(function (player) {
                    return (player.rank < 3) ^ inverse;
                });
                break;
            case "best":
                ret = this.players.filter(function (player) {
                    return (player.rank == 1) ^ inverse;
                });
                break;
            case "worst":
                var joined = this.players.filter(function (player) {
                    return player.joined;
                }).length;
                ret = this.players.filter(function (player) {
                    return (player.rank == joined) ^ inverse;
                });
                break;
            case "joined":
                return this.players.filter(function (player) {
                    return player.joined;
                });
            default:
            case "all":
                ret = this.players;
                break;
        }
        console.log(ret.map(function (player) {
            return player.playerId
        }));
        return ret;
    },
    // Zum Verteilen von allgemeinen ws-messages an alle Player.
    // diese funktion bemüht den wsManager und sichert die letzte Message zum Ausliefern bei Client-Reload
    broadcastMessage: function (type, data) {
        wsManager.msgDevicesByRole("player", type, data);
        if (type === "display") this.players.forEach(function (player) {
            player.lastDisplayMessage = data;
        });
    },
    // Zum Benachrichtigen einzelner Player
    sendMessage: function (playerId, type, data) {
        wsManager.msgDeviceByIds([this.players[playerId].clientId], type, data);
        if (type === "display") this.players.lastDisplayMessage = data;
    },

    sendInventory: function (playerId) {
        if (this.players[playerId]) this.sendMessage(playerId, "inventory", this.players[playerId].inventory);
    },
    sendPlayerStatus: function (playerId) {
        console.log("playerManager sending playerStatus");
        if (this.players[playerId]) {
            this.sendMessage(playerId, "joined", {
                player: {
                    playerId: playerId,
                    joined: this.players[playerId].joined,
                    colors: this.players[playerId].colors,
                    seat: this.players[playerId].seat,
                    score: this.players[playerId].score,
                    rank: this.players[playerId].rank,
                    selected: this.players[playerId].selected,
                    away: this.players[playerId].away
                },
                colors: this.colors,
                rating: this.rating[playerId]
            });
            this.sendInventory(playerId);
            if (this.players[playerId]) this.sendMessage(playerId, "dealStatus", this.players[playerId].deals);
        }
        //TODO: calcRanking() könnte auch alleinig in score() untergebracht werden... oder?
        this.calcRanking();
        var msg = {
            otherPlayers: this.getPlayerArray(),
            maxPlayers: gameConf.maxPlayerCnt,
            avgRatings: this.avgRatings
        };
        this.broadcastMessage("status", msg);
        wsManager.msgDevicesByRole("master", "status", msg);
        wsManager.msgDevicesByRole("MC", "status", msg);
    },
    sendGameEvent: function (playerId, type, value, reason, text) {
        this.sendMessage(playerId, "gameEvent", {type: type, value: value, text: text, reason: reason})
    },
    getPlayerIdForClientId: function (clientId) {
        var playerId = -1;
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].clientId == clientId) playerId = i;
        }
        return playerId;
    },
    calcRanking: function () {
        console.log("playerManager calcs ranking");
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
    score: function (playerId, score, reason) {
        this.players[playerId].score += parseInt(score);
        this.sendGameEvent(playerId, "score", score, reason, "You got " + score + "Points");
        var deals = [];
        for (var deal in this.deals) if (this.deals.hasOwnProperty(deal)) deals.push(this.deals[deal]);

        var self = this;
        if (deals.length > 0) {
            deals.filter(function(deal) {
                return deal.state === 3;
            }).forEach(function (deal) {
                var otherPlayerId = deal.player0Id;
                if (otherPlayerId == playerId) otherPlayerId = deal.player1Id;
                while (self.players[playerId].score - self.players[otherPlayerId].score > 4) {
                    self.players[playerId].score--;
                    self.sendGameEvent(playerId, "score", -1, "insurance", "You got " + -1 + " Points");
                    self.players[otherPlayerId].score++;
                    self.sendGameEvent(otherPlayerId, "score", +1, "insurance", "You got " + +1 + " Points");

                }
                while (self.players[otherPlayerId].score - self.players[playerId].score > 4) {
                    pScore = self.players[playerId].score++;
                    self.sendGameEvent(playerId, "score", 1, "insurance", "You got " + 1 + " Points");
                    opScore = self.players[otherPlayerId].score--;
                    self.sendGameEvent(otherPlayerId, "score", -1, "insurance", "You got " + -1 + " Points");
                }
            })
        }
        this.calcRanking();
        this.sendPlayerStatus(-1);
    },
    setAgreement: function (agreement) {
        this.setRelation({id: agreement.id, playerIds: agreement.playerIds, type: agreement.agreementType})
    },
    setRelation: function (relation) {
        this.relations[relation.id] = relation;
        var self = this;
        relation.playerIds.forEach(function (playerId) {
            self.sendGameEvent(playerId, relation.type, relation.playerIds, "A new " + relation.type);
        });
        this.sendPlayerStatus(-1);
    },
    getRelationsForPlayer: function (playerId) {
        var self = this;
        var relForPlayer = [];
        Object.keys(this.relations).forEach(function (key) {
            if (self.relations[key].playerIds.indexOf(playerId) != -1) relForPlayer.push(self.relations[key]);
        });
        return relForPlayer;
    },
    getPlayerArray: function () {
        var ret = [];
        for (var i = 0; i < this.players.length; i++) {
            ret.push({
                joined: this.players[i].joined,
                busy: this.players[i].busy,
                playerId: this.players[i].playerId,
                colors: this.players[i].colors,
                seat: this.players[i].seat,
                score: this.players[i].score,
                rank: this.players[i].rank,
                timeRank: this.players[i].timeRank,
                selected: this.players[i].selected,
                onTurn: (i == this.onTurn),
                upcoming: (i == this.upcoming),
                away: this.players[i].away,
                relations: this.getRelationsForPlayer(i)
            });
        }
        return ret;
    },
    seatPlayer: function (clientId) {
        //find available playerId:
        //1. check if there are unseated players (clientId == -1)
        //2. check if there are unjoined players
        var playerId = -1;
        for (var i = gameConf.maxPlayerCnt - 1; i >= 0; i--) {
            if (this.players[i].clientId == -1) playerId = i;
        }
        if (playerId == -1) {
            for (var i = gameConf.maxPlayerCnt - 1; i >= 0; i--) {
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
    advanceTurn: function (x) {
        this.onTurn += x;
        this.onTurn %= this.players.length;
        if (!this.players[this.onTurn].joined || this.players[this.onTurn].away) {
            if (this.upcoming == this.onTurn) {
                this.upcoming = -1; // reset
            }
            this.advanceTurn(1);
            return;
        }
        if (this.upcoming == this.onTurn || this.upcoming == -1) {
            this.setUpcoming(this.onTurn + 1);
        }
        this.sendPlayerStatus(-1);
        console.log("Now on turn: " + this.onTurn);
    },
    advanceTurnTo: function (x) {
        this.onTurn = x;
        this.onTurn %= this.players.length;
        if (!this.players[this.onTurn].joined || this.players[this.onTurn].away) {
            if (this.upcoming == this.onTurn) {
                this.upcoming = -1;
            }
            this.advanceTurn(1);
            return;
        }
        if (this.upcoming == this.onTurn || this.upcoming == -1) {
            this.setUpcoming(this.onTurn + 1);
        }
        this.sendPlayerStatus(-1);
        console.log("Now on turn: " + this.onTurn);
    },

    // der, der nach dem nächsten dran sein soll
    setUpcoming: function (x) {
        this.upcoming = x;
        this.upcoming %= this.players.length;
        if (!this.players[this.upcoming].joined || this.players[this.upcoming].away) {
            this.setUpcoming(x + 1);
            return;
        }
        this.sendPlayerStatus(-1);
        console.log("Next on turn: " + this.upcoming);
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
