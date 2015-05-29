(function () {
    'use strict';

    var wsManager = require('./wsManager.js');
    var gameConf = require('./gameConf');
    var gameRecording = require('./gameRecording');
    require('../homevisit_components/stringFormat');
    var logger = require('log4js').getLogger("playerManager");
    logger.setLevel("INFO");

    var PlayerManager = function () {
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
        this.gameEvents = [];
        this.gettext = require('./gettext');
    };

    PlayerManager.prototype = {
        //erzeugt das player-array (inklusive inventory - dieses wird derzeit nicht mehr genutzt)
        init: function () {
            for (var i = 0; i < gameConf.maxPlayerCnt; i++) {
                this.players.push({
                    playerId: i,
                    clientId: -1,
                    playercolor: [
                        this.gettext.gettext('red'),
                        this.gettext.gettext('light blue'),
                        this.gettext.gettext('dark blue'),
                        this.gettext.gettext('orange'),
                        this.gettext.gettext('yellow'),
                        this.gettext.gettext('green'),
                        this.gettext.gettext('lilac'),
                        this.gettext.gettext('pink')
                    ][i],
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
        },
        resetPlayers: function () {
            this.deals = {};
            this.relations = {};
            this.players.forEach(function (player) {
                player.score = 0;
                player.rank = -1;
                player.selcted = false;
                player.away = false;
                player.deals = {};
                player.busy = false;
            });
            this.sendPlayerStatus(-1);
            this.gameEvents = [];
        },
        log: function (message) {
            message = "PMANAGER: " + message;
            wsManager.msgDevicesByRole("master", "log", message);
        },

        // callback-funktion für alle eingehenden role=player-nachrichten
        playerMessage: function (clientId, msg) {
            if (typeof msg !== "undefined") {
                try {
                    switch (msg.type) {
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

                        case "deal":
                            this.deal(clientId, msg.data);
                            break;

                        case "disconnected":
                            this.leaveGame(clientId);
                            break;

                        default:
                            logger.info("unknown message-type");
                            break;
                    }
                } catch (e) {
                    logger.error("ERROR in playerManager.newMessage! " + e.stack);
                }
            }
        },
        // und die player-aktions-funktionen
        leaveGame: function (clientId) {
            var playerId = this.getPlayerIdForClientId(clientId);
            this.players[playerId].joined = false;
            // distribute the points of this player to the others
            this.distributePointsOf(playerId);
            require('./setupMonitoring.js').checkPlayers(this.players);
            this.sendPlayerStatus(playerId);
        },
        distributePointsOf: function (playerId) {
            var pointsPool = this.players[playerId].score;
            var luckyPlayerId = -1;
            while (pointsPool > 0) {
                luckyPlayerId = this.findBestPlayerBelowPositiveScore();
                if (luckyPlayerId === -1) return;
                this.players[luckyPlayerId].score = this.players[luckyPlayerId].score + 1;
                pointsPool = pointsPool - 1;
            }
            this.players[playerId].score = 0;
        },
        findBestPlayerBelowPositiveScore: function () {
            var bestNegScore = -1000;        // ridiculously low value
            var id = -1;
            for (var i = 0; i < this.players.length; i++) {
                if (this.players[i].joined && this.players[i].score <= 0 && this.players[i].score > bestNegScore) {
                    bestNegScore = this.players[i].score;
                    id = i;
                }
            }
            return id;
        },
        requestJoin: function (clientId, msg) {
            //var client = this.clients[clientId];
            var playerId;        //der player, der zu diesem client gehört.
            //schau mal, ob es einen player gibt, der über diesen client gespielt hat
            //wen ja, sende diesen player
            //wenn nicht, schaue, ob noch ein platz frei ist und vergebe ihn
            playerId = this.getPlayerIdForClientId(clientId);
            if (playerId === -1) {
                playerId = this.seatPlayer(clientId);
            }
            if (playerId === -1) {
                //kein freier platz!sc
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
            require('./setupMonitoring.js').checkPlayers(this.players);
            if (!!this.players[playerId].lastDisplayMessage) {
                this.players[playerId].lastDisplayMessage.silent = true;
                wsManager.msgDeviceByIds([clientId], "display", this.players[playerId].lastDisplayMessage);
                //this.msgDevicesByRole('player', 'rates', {avgRating: this.avgRating});
            }
        },
        vote: function (clientId, data) {
            var playerId = data.playerId;
            var pollId = data.pollId;
            logger.info("Got Vote for " + pollId + " from Player " + playerId);

            wsManager.msgDevicesByRole('MC', 'vote', data);
            logger.info("VOTE GESENDET!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");

            var poll = this.polls[pollId];
            if (typeof poll === "undefined") {
                this.sendMessage(playerId, "display", {
                    text: this.gettext.gettext("This poll doesn't exist!")
                });
                return;
            }

            data.multiplier = this.players.filter(function (p) {
                return p.joined;
            }).length - this.players[playerId].rank + 1;
            //        vote.multiplier = this.avgRatings[playerId];

            poll.vote(data);
        },
        rate: function (clientId, data) {
            var playerId = data.playerId;
            var rate = data.rate;
            this.rating[playerId] = rate;
            logger.info("rate: " + this.rating);
            this.calcAvgRate();

            this.broadcastMessage('rates', {avgRatings: this.avgRatings});
        },
        //deals werden immer komplett versendet mit unique .id
        //wenn es den deal noch nicht gibt im deal-array, dann füge ihn ein, sonst update ihn.
        //je nach state an .playerId0 oder .playerId1 schicken
        deal: function (clientId, deal) {
            switch (deal.status) {
                case "request":
                    if (this.players[deal.player1Id].busy) {
                        this.sendMessage(deal.player0Id, "deal", {status: "busy"});
                    } else {
                        var newDealId = require('hat')();
                        deal.id = newDealId;
                        deal.player1Id = parseInt(deal.player1Id);
                        this.deals[deal.id] = deal;
                        this.players[deal.player0Id].busy = true;
                        this.players[deal.player1Id].busy = true;
                        this.sendMessage(deal.player0Id, "deal", deal);
                        this.sendMessage(deal.player1Id, "deal", deal);
                    }
                    break;
                case "confirm":
                    deal.player1Id = parseInt(deal.player1Id);
                    this.deals[deal.id] = deal;
                    this.players[deal.player0Id].deals[deal.id] = deal;
                    this.players[deal.player1Id].deals[deal.id] = deal;
                    this.sendMessage(deal.player0Id, "deal", deal);
                    this.sendMessage(deal.player1Id, "deal", deal);
                    this.sendGameEvent(deal.player0Id, "insurance", deal.player1Id, "");
                    this.sendGameEvent(deal.player1Id, "insurance", deal.player0Id, "");
                    this.calcInsurance(deal.player0Id);
                    this.calcInsurance(deal.player1Id);
                    gameRecording.deal({
                        type: 'insurance',
                        playerIds: [parseInt(deal.player0Id), parseInt(deal.player1Id)],
                        state: 'confirmed'
                    });
                    break;
                default:
                case "deny":
                    deal.player1Id = parseInt(deal.player1Id);
                    this.deals[deal.id] = deal;
                    this.players[deal.player0Id].busy = false;
                    this.players[deal.player1Id].busy = false;
                    this.sendMessage(deal.player0Id, "deal", deal);
                    this.sendMessage(deal.player1Id, "deal", deal);
                    gameRecording.deal({
                        type: 'insurance',
                        playerIds: [parseInt(deal.player0Id), parseInt(deal.player1Id)],
                        state: 'denied'
                    });
                    break;
                case "denyDealing":
                    var newDealId = require('hat')();
                    deal.id = newDealId;
                    this.deals[deal.id] = deal;
                    this.players[deal.player0Id].busy = true;
                    break;
            }
            this.sendPlayerStatus(-1);
        },

        //TODO: subscribeStatus oder so ausdenken um berücksichtigt zu werden, immer wenn playerStatus neu gesendet wird
        requestStatus: function (clientId, role, msg) {
            if (role !== "MC" && role !== "master") {
                return;
            }
            if (msg.type === "register") {
                this.sendPlayerStatus(-1);
            }
        },

        //callback für mc-messages. bei register wird status versendet, der MC kann auch punkte vergeben
        scoreMessage: function (clientId, role, msg) {
            if (msg.type === "score") {
                this.score(msg.data.playerId,
                    msg.data.score,
                    msg.data.reason,
                    msg.data.otherPlayerId);
            }
        },

        setStatusMessage: function (clientId, role, msg) {
            var data = msg.data;
            logger.info(data);
            if (typeof data !== "undefined") {
                try {
                    switch (data.cmd) {
                        //case "score":
                        //        this.score(data, data.id, data.value);
                        //    break;
                        case "toggleSelected":
                            this.players[data.id].selected ^= true;
                            logger.info("Set Player #: " + data.id + " .selected = " + this.players[data.id].selected);
                            break;
                        case "deselectAll":
                            this.players.forEach(function (player) {
                                player.selected = false;
                            });
                            logger.info("Deselect All Players");
                            break;
                        case "toggleAway":
                            this.players[data.id].away ^= true;
                            logger.info("Set Player #: " + data.id + " .away = " + this.players[data.id].away);
                            break;
                        case "setUpcoming":
                            this.setUpcoming(data.id);
                            logger.info("Set Player #: " + data.id + " as upcoming");
                            break;
                        case "setAct":
                            logger.info("Set Player #: " + data.id + " as active");
                            break;
                        case "throwOut":
                            logger.info("Remove Player #: " + data.id + " from game");
                            this.leaveGame(this.players[data.id].clientId);
                            break;
                        default:
                            logger.info("unknown message-type");
                            break;
                    }
                } catch (e) {
                    logger.info("ERROR in playerManager.newMessage! " + e.stack);
                }
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
                        item.poll.setMaxVotes(this.deliverMessage(device, "display", item.getWsContent()));
                        wsManager.msgDevicesByRole('MC', 'startvote', item.getWsContent());
                        logger.info("STARTVOTE GESENDET!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                        break;
                    case "card":
                        this.deliverMessage(device, "display", item.getWsContent());
                        wsManager.msgDevicesByRole('MC', 'card', item.getWsContent());
                        logger.info("CARD GESENDET!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                        break;
                    case "results":
                        this.deliverMessage(device, "display", item.getWsContent());
                        //wsManager.msgDevicesByRole('MC', 'results', item.getWsContent());
                        //logger.info("RESULTS GESENDET!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                        //this.results(item);
                        break;
                    case "eval":
                        this.eval(item.text);
                        break;
                    case "rating":
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
                        this.deliverMessage(device, "display", item.getWsContent());
                        break;
                }
            } catch (e) {
                //TODO: einen schönen weg finden, um solche Errors nach möglichkeit im admin-log zu zeigen
                logger.info("ERROR in playerManager.addItem! " + e.stack);
            }
        },
        results: function (resultItem) {
            //logger.info("preparing result " + resultId);
            //var newestVoteId = this.voteItems.length - 1;
            //var resultItem = this.resultItems[resultId];
            if (resultItem.opts) {
                switch (resultItem.opts[1]) {
                    case "optionScore":
                        //this.calcScore("correct", newestVoteId);
                        break;

                    case "majorityScore":
                        //this.calcScore("majority", newestVoteId);
                        break;

                    default:
                        break;
                }
            }
            this.sendVoteResults(resultItem);
        },
        sendVoteResults: function (resultItem) {
            var resultType = resultItem.resultType;
            var result = resultItem.data;
            var msg = result.text;
            var labels = [];
            var resData = [];

            //"::::" erzeugt zwei Zeilenumbrüche in der Darstellung in der playerApp
            //logger.info("maxVoteCount=" + voteItem.maxCount);
            if (resultType === "numberStats") {
                //send stats as array: [sum, avg]
                resData = [result.sum, result.average, result.minVal, result.maxVal];
            }
            else {
                result.voteOptions.forEach(function (option) {
                    labels.push(option.text + ": " + option.percent + "% (" + option.votes + ")");
                    if (resultType === "europeMap") {
                        resData.push({
                            id: option.value,
                            val: option.percent
                        });
                    }
                    else {
                        resData.push(option.result);
                    }
                });
            }
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
            });
        },
        //TODO: findSeatOrder ergibt noch keinen Sinn am ende - wird aber auch nicht verwendet ;)
        findSeatOrder: function (voteId) {

            var voteItem = this.voteItems[voteId];

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
                if (order.indexOf(next) !== -1) {
                    ok = false;
                    break;
                }
                order.push(next);
                this.players[i].seat = next;
                next = answers[next];
            }
            if (!ok) {
                logger.info("Answers are not yielding an Order!");
            }
            this.sendPlayerStatus(-1);
            this.broadcastMessage("display", {type: "seatOrder"});
        },

        playRoulette: function (result) {
            logger.info("play roulette");
            var self = this;
            self.broadcastMessage("display", {
                type: 'card',
                text: this.gettext.gettext('You are NOT in the game!')
            });
            logger.info(result.positivePlayerIds);
            if (result.positivePlayerIds.length === 0) {
                return;
            }
            result.positivePlayerIds.forEach(function (playerId) {
                self.sendMessage(playerId, "display", {
                    type: 'card',
                    text: self.gettext.gettext('You are in the game!')
                });
            });
            var steps = Math.floor(Math.random() * result.positivePlayerIds.length) + 23;

            this.rouletteStep(steps, result, function (item, winner) {
                self.finishRoulette(item, winner);
            });
        },

        rouletteStep: function (steps, item, cb) {
            var cnt = item.positivePlayerIds.length;
            var turn = item.positivePlayerIds[steps % cnt];
            var self = this;
            logger.info("step " + steps + "turn=" + turn);
            if (steps === 0) {
                cb.call(self, item, turn);
            }
            else {
                setTimeout(function () {
                    self.sendMessage(turn, "fx", {type: "flashAndSound", color: "#ff0000", sound: "zip", time: 500});
                    self.rouletteStep(steps - 1, item, cb);
                }, Math.pow((35 - steps) * 30, 2) / 1000);
            }
        },

        finishRoulette: function (item, winner) {
            var amount = item.positivePlayerIds.length;
            var winners = [winner];
            var self = this;
            if (amount > 3) {
                //zwei gewinner
                var id0 = item.positivePlayerIds.indexOf(winner);
                var id1 = id0 + Math.floor(amount / 2) % amount;
                winners.push(item.positivePlayerIds[id1]);
            }
            logger.info("and the winner is: " + winners);
            winners.forEach(function (win) {
                self.sendMessage(win, "fx", {type: "flashAndSound", color: "green", sound: "win", time: 2000});
            });
            item.positivePlayerIds.forEach(function (player) {
                if (winners.indexOf(player) > -1) {
                    self.score(player, item.win, "roulette");
                }
                else {
                    self.score(player, -item.cost, "roulette");
                }
            });
        },

        //schau mal, ob im ziel-device ein spezial steckt (zB player:next)
        //hier steckt auch die logik des weiterschaltens
        deliverMessage: function (device, type, content) {
            var specialPlayer = device.split(":")[1];
            var self = this;
            if (typeof specialPlayer === "undefined") {
                specialPlayer = "all";
            }
            if (specialPlayer === "next") {
                this.broadcastMessage("display", {type: "black"});
                if (this.upcoming === this.onTurn + 1 || this.upcoming === -1) {
                    this.advanceTurn(1);
                } else {
                    this.advanceTurnTo(this.upcoming);
                }
                specialPlayer = "act";
            }
            var players = this.getPlayerGroup(specialPlayer);
            //                this.broadcastMessage(type, {type: "black"});

            if (typeof content.text !== "undefined") {
                content.text = content.text.replace(/<player:([!]*\w*)>/g, function (match, $1) {
                    var players = self.getPlayerGroup($1);
                    return players.map(function (player) {
                        return "<player-icon pid='" + player.playerId + "'></player-icon>";
                    }).join("");
                });
            }

            players.forEach(function (player) {
                self.sendMessage(player.playerId, type, content);
            });
            return players.length;

        },

        getPlayerGroup: function (identifier) {
            logger.debug("getPlayerGroup " + identifier);
            var ret;
            var self = this;
            var inverse = false;
            var param;
            if (typeof identifier === 'undefined') {
                return;
            }
            if (identifier.indexOf("!") === 0) {
                inverse = true;
                identifier = identifier.substring(1);
            }
            if (identifier.indexOf("rank") == 0) {
                param = parseInt(identifier.substring(4));
                identifier = identifier.substring(0, 4);
            }
            switch (identifier) {
                case "act":
                case "active":
                    ret = this.players.filter(function (player) {
                        ret = player.seat === self.onTurn ^ inverse;
                        return ret;
                    });
                    break;
                case "sel":
                case "selected":
                    ret = this.players.filter(function (player) {
                        ret = player.selected ^ inverse;
                        return ret;
                    });
                    break;
                case "topTwo":
                    ret = this.players.filter(function (player) {
                        ret = player.rank < 3 ^ inverse;
                        return ret;
                    });
                    break;
                case "best":
                    ret = this.players.filter(function (player) {
                        return player.rank === 1 ^ inverse;
                    });
                    break;
                case "worst":
                    var joined = this.players.filter(function (player) {
                        return player.joined;
                    }).length;
                    ret = this.players.filter(function (player) {
                        return player.rank === joined ^ inverse;
                    });
                    break;
                case "joined":
                    ret = this.players.filter(function (player) {
                        return player.joined;
                    });
                    break;
                case "rank":
                    ret = this.players.filter(function (player) {
                        return player.rank === param ^ inverse;
                    });
                    break;
                default:
                case "all":
                    ret = this.players;
                    break;
            }
            var ret2 = ret.filter(function (player) {
                return player.joined;
            });
            logger.debug(ret2.map(function (player) {
                return player.playerId;
            }));
            return ret2;
        },
        // Zum Verteilen von allgemeinen ws-messages an alle Player.
        // diese funktion bemüht den wsManager und sichert die letzte Message zum Ausliefern bei Client-Reload
        broadcastMessage: function (type, data) {
            wsManager.msgDevicesByRole("player", type, data);
            if (type === "display") {
                this.players.forEach(function (player) {
                    player.lastDisplayMessage = data;
                });
            }
        },
        // Zum Benachrichtigen einzelner Player
        sendMessage: function (playerId, type, data) {
            wsManager.msgDeviceByIds([this.players[playerId].clientId], type, data);
            if (type === "display") {
                this.players.lastDisplayMessage = data;
            }
        },

        sendInventory: function (playerId) {
            if (this.players[playerId]) {
                this.sendMessage(playerId, "inventory", this.players[playerId].inventory);
            }
        },
        sendPlayerStatus: function (playerId) {
            logger.info("playerManager sending playerStatus");
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
                if (this.players[playerId]) {
                    this.sendMessage(playerId, "dealStatus", this.players[playerId].deals);
                }
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
        sendGameEvent: function (playerId, type, value, reason, otherPlayerId) {
            var event = {
                type: type,
                value: value,
                reason: reason,
                otherPlayerId: otherPlayerId,
                playerId: playerId
            };
            this.sendMessage(playerId, "gameEvent", event);
            this.gameEvents.push({
                playerId: playerId,
                event: event
            });
            if (reason === "rating") {
                wsManager.msgDevicesByRole("MC", "score", event);
            }

            if (type === "insurance") {
                wsManager.msgDevicesByRole("MC", "insurance", event);
            }

        },
        getPlayerIdForClientId: function (clientId) {
            var playerId = -1;
            for (var i = 0; i < this.players.length; i++) {
                if (this.players[i].clientId === clientId) {
                    playerId = i;
                }
            }
            return playerId;
        },
        calcRanking: function () {
            logger.info("playerManager calcs ranking");
            var self = this;
            var ranking = this.players.map(function (p, id) {
                return {
                    playerId: id,
                    score: p.joined ? p.score : -1000
                };
            }).sort(function (a, b) {
                return b.score - a.score;
            });
            ranking.forEach(function (rank, id) {
                self.players[rank.playerId].rank = id + 1;
            });
        },
        score: function (playerId, score, reason, otherPlayerId) {
            if (score === 0) return;
            if (typeof reason === "undefined") {
                reason = "?";
            }
            this.players[playerId].score += parseInt(score);
            if (reason === "rating") {
                this.sendGameEvent(otherPlayerId, "rating", score, "player", playerId);
            }
            this.sendGameEvent(playerId, "score", score, reason, otherPlayerId);
            this.calcInsurance(playerId);
            this.calcRanking();
            this.sendPlayerStatus(-1);

            gameRecording.score({
                playerId: parseInt(playerId),
                scoreDiff: score,
                score: this.players[playerId].score,
                rank: this.players[playerId].rank,
                type: reason,
                otherPlayerId: otherPlayerId
            });
        },
        calcInsurance: function (playerId) {
            playerId = parseInt(playerId);
            var deals = [];
            for (var deal in this.deals) {
                if (this.deals.hasOwnProperty(deal)) {
                    if (this.deals[deal].status === "confirm" &&
                        (this.deals[deal].player0Id === playerId || this.deals[deal].player1Id === playerId)) {
                        deals.push(this.deals[deal]);
                    }
                }
            }
            var self = this;
            if (deals.length > 0) {
                deals.forEach(function (deal) {
                    var otherPlayerId = deal.player0Id;
                    if (otherPlayerId === playerId) {
                        otherPlayerId = deal.player1Id;
                    }
                    while (self.players[deal.player0Id].score - self.players[deal.player1Id].score > 4) {
                        self.players[deal.player0Id].score--;
                        self.sendGameEvent(deal.player0Id, "score", -1, "insurance", deal.player1Id);
                        gameRecording.score({
                            playerId: parseInt(deal.player0Id),
                            scoreDiff: -1,
                            score: self.players[deal.player0Id].score,
                            rank: self.players[deal.player0Id].rank,
                            type: 'insurance',
                            otherPlayerId: deal.player1Id
                        });
                        self.players[deal.player1Id].score++;
                        self.sendGameEvent(deal.player1Id, "score", +1, "insurance", deal.player0Id);
                        gameRecording.score({
                            playerId: parseInt(deal.player1Id),
                            scoreDiff: 1,
                            score: self.players[deal.player1Id].score,
                            rank: self.players[deal.player1Id].rank,
                            type: 'insurance',
                            otherPlayerId: deal.player0Id
                        });
                    }
                    while (self.players[deal.player1Id].score - self.players[deal.player0Id].score > 4) {
                        self.players[deal.player0Id].score++;
                        self.sendGameEvent(deal.player0Id, "score", 1, "insurance", deal.player1Id);
                        gameRecording.score({
                            playerId: parseInt(deal.player0Id),
                            scoreDiff: 1,
                            score: self.players[deal.player0Id].score,
                            rank: self.players[deal.player0Id].rank,
                            type: 'insurance',
                            otherPlayerId: deal.player1Id
                        });
                        self.players[deal.player1Id].score--;
                        self.sendGameEvent(deal.player1Id, "score", -1, "insurance", deal.player0Id);
                        gameRecording.score({
                            playerId: parseInt(deal.player1Id),
                            scoreDiff: -1,
                            score: self.players[deal.player1Id].score,
                            rank: self.players[deal.player1Id].rank,
                            type: 'insurance',
                            otherPlayerId: deal.player0Id
                        });
                    }
                });
            }
        },
        setAgreement: function (agreement) {
            var self = this;
            this.setRelation({
                id: agreement.id,
                playerIds: agreement.playerIds,
                type: agreement.agreementType
            });
            agreement.playerIds.forEach(function (playerId) {
                self.score(playerId, -1, "alliance");
            })
            gameRecording.agreement(agreement);
        },
        setRelation: function (relation) {
            this.relations[relation.id] = relation;
            var self = this;
            relation.playerIds.forEach(function (playerId) {
                self.sendGameEvent(playerId,
                    relation.type,
                    relation.playerIds,
                    self.gettext.gettext('A new %s').format(relation.type)
                );
            });
            this.sendPlayerStatus(-1);
        },
        getRelationsForPlayer: function (playerId) {
            var self = this;
            var relForPlayer = [];
            Object.keys(this.relations).forEach(function (key) {
                if (self.relations[key].playerIds.indexOf(playerId) !== -1) {
                    relForPlayer.push(self.relations[key]);
                }
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
                    onTurn: i === this.onTurn,
                    upcoming: i === this.upcoming,
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
            var playerId = -1, i;
            for (i = gameConf.maxPlayerCnt - 1; i >= 0; i--) {
                if (this.players[i].clientId === -1) {
                    playerId = i;
                }
            }
            if (playerId === -1) {
                for (i = gameConf.maxPlayerCnt - 1; i >= 0; i--) {
                    if (this.players[i].joined === false) {
                        playerId = i;
                    }
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
                    if (i !== j && this.players[i].joined) {
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
                if (typeof votes[i] !== "undefined") {
                    for (var j = 0; j < voteOptions.length; j++) {
                        if (!voteOptions[j].result) {
                            voteOptions[j].result = 0;
                        }
                        if (!voteOptions[j].votes) {
                            voteOptions[j].votes = 0;
                        }
                        if (votes[i][j].checked) {
                            voteItem.voteCount += voteItem.multiplier[i]; //votes[i].multiplier;
                            if (voteItem.opts[0] === "enterNumber") {
                                voteOptions[j].result += parseFloat(votes[i][j].val);
                                if (parseFloat(votes[i][j].val) < voteItem.minVal) {
                                    voteItem.minVal = parseFloat(votes[i][j].val);
                                }
                                if (parseFloat(votes[i][j].val) > voteItem.maxVal) {
                                    voteItem.maxVal = parseFloat(votes[i][j].val);
                                }
                            }
                            else {
                                voteOptions[j].result += voteItem.multiplier[i];
                                if (voteOptions[j].result > voteOptions[bestOption].result) {
                                    bestOption = j;
                                }
                            }
                            voteOptions[j].votes += 1;
                        }
                    }
                }
            }
            voteItem.maxCount = voteOptions[bestOption].result;
            voteItem.bestOption = bestOption;
            voteOptions.sort(function (a, b) {
                return b.result - a.result;
            });
            var game = require('./game.js');
            game.trigger(-1, {data: 'go'});
            //        this.sendVoteResults(voteId);
        },

        //der nächste ist dran...
        advanceTurn: function (x) {
            if (this.getPlayerGroup("joined").length < 2) {
                return;
            }
            this.onTurn += x;
            this.onTurn %= this.players.length;
            if (!this.players[this.onTurn].joined || this.players[this.onTurn].away) {
                if (this.upcoming === this.onTurn) {
                    this.upcoming = -1; // reset
                }
                this.advanceTurn(1);
                return;
            }
            if (this.upcoming === this.onTurn || this.upcoming === -1) {
                this.setUpcoming(this.onTurn + 1);
            }
            this.sendPlayerStatus(-1);
            logger.info("Now on turn: " + this.onTurn);
        },
        advanceTurnTo: function (x) {
            this.onTurn = x;
            this.onTurn %= this.players.length;
            if (!this.players[this.onTurn].joined || this.players[this.onTurn].away) {
                if (this.upcoming === this.onTurn) {
                    this.upcoming = -1;
                }
                this.advanceTurn(1);
                return;
            }
            if (this.upcoming === this.onTurn || this.upcoming === -1) {
                this.setUpcoming(this.onTurn + 1);
            }
            this.sendPlayerStatus(-1);
            logger.info("Now on turn: " + this.onTurn);
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
            logger.info("Next on turn: " + this.upcoming);
        }
    };

    var playerManagerObj = new PlayerManager();
    playerManagerObj.init();

    module.exports = playerManagerObj;

})();
