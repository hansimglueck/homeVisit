angular.module('playerAppServices', [])
    .factory('Home', function (Socket, $location, fxService, Status, $timeout, DealFactory) {
        var homeFactory = {};
        homeFactory.displayData = {};
        homeFactory.type = "vote";
        homeFactory.labels = [];
        homeFactory.options = null;
        homeFactory.voteId = -1;
        homeFactory.checked = 0;
        homeFactory.showGo = false;
        homeFactory.timeout;

        homeFactory.timedVote = function () {
            //TODO: wenn eine nummer-eingabe-abstimmung läuft sollte die eingegebene nummer, wenn auch noch nicht gesendet, verwendet werden
            if (homeFactory.time == 0) return;
            if (homeFactory.time < 10) {
                fxService.startCountdown(homeFactory.time, homeFactory.confirmVote);
            }
            else {
                homeFactory.timeout = $timeout(function () {
                    fxService.startCountdown(10, homeFactory.confirmVote);
                }, (homeFactory.time - 10) * 1000);
            }
        };
        homeFactory.vote = function () {
            homeFactory.voteChoiceText = homeFactory.options.filter(function (opt) {
                return opt.checked
            }).map(function (opt) {
                return opt.text
            });
            homeFactory.voteChoice = homeFactory.options.filter(function (opt) {
                return opt.checked
            }).map(function (opt) {
                return opt.value
            });
            $location.path("/voteConfirm");
        };
        homeFactory.confirmVote = function () {
            if (typeof homeFactory.voteChoice == "undefined") homeFactory.voteChoice = [];
            console.log(homeFactory.voteChoice);
            if (homeFactory.timeout) {
                console.log("cancel timeout!");
                $timeout.cancel(homeFactory.timeout);
            }
            fxService.cancelCountdown();
            Socket.emit("vote", {
                choice: homeFactory.voteChoice,
                text: homeFactory.voteChoiceText,
                playerId: Status.player.playerId,
                pollId: homeFactory.pollId
            });
            $location.path("/voteFinished");
        };

        homeFactory.start = function () {
            Socket.on('display', function (data) {
                console.log("new display: " + data.type);
                fxService.cancelCountdown();
                homeFactory.type = "card";
                homeFactory.labels = [];
                homeFactory.options = null;
                if (data) {
                    if (!!data.text) homeFactory.text = data.text.split("::");
                    //homeFactory.showGo = false;
                    if (typeof data.showGo != "undefined") homeFactory.showGo = data.showGo;
                    homeFactory.displayData = data;
                    if (data.type) {
                        if (!data.silent) fxService.playSound(data.type);
                        switch (data.type) {
                            case "agreement":
                            case "vote":
                                homeFactory.type = "vote";
                                homeFactory.voteType = data.voteType;
                                homeFactory.options = data.voteOptions || [{value: 0}];
                                if (homeFactory.voteType == "enterNumber") homeFactory.options[0].checked = true;
                                homeFactory.limit = (homeFactory.voteType == "customOptions") ? 1 : data.voteMulti;
                                homeFactory.checked = 0;
                                homeFactory.votelast = "vote";
                                homeFactory.pollId = data.pollId;
                                homeFactory.ratedVote = data.ratedVote;
                                homeFactory.time = parseInt(data.time);
                                homeFactory.timedVote();
                                $location.path("/vote");
                                return;
                                break;
                            case "results":
                                var resultType = data.resultType;
                                var result = data.data;
                                var msg = data.text;

                                var labels = [];
                                var resData = [];
                                homeFactory.correctAnswer = "";
                                //"::::" erzeugt zwei Zeilenumbrüche in der Darstellung in der playerApp
                                if (resultType == "numberStats") {
                                    //send stats as array: [sum, avg]
                                    resData = [result.sum, result.average, result.minVal, result.maxVal];
                                }
                                else result.voteOptions.forEach(function (option) {
                                    if (option.correctAnswer) homeFactory.correctAnswer = option.text;
                                    labels.push(option.text + ": " + option.percent + "% (" + option.votes + " Votes)");
                                    if (resultType == "europeMap") resData.push({
                                        id: option.value,
                                        val: option.percent
                                    });
                                    else resData.push(option.result);
                                });

                                homeFactory.resultType = resultType;
                                (homeFactory.resultType == 'Bar' || homeFactory.resultType == 'Line') ? homeFactory.data = [resData] : homeFactory.data = resData;
                                homeFactory.labels = labels;
                                homeFactory.votelast = "result";
                                homeFactory.type = "result";
                                homeFactory.resultColor = data.resultColor;
                                $location.path("/results");
                                return;
                                break;
                            case "rating":
                                homeFactory.type = "rating";
                                var path = "/rating";
                                if (data.ratingType ==="allTeams") {
                                    path += "/player";
                                    if (data.posNeg == "+1") path+= "/1";
                                    else path += "/-1";
                                }
                                if (data.ratingType === "oneTeam") {
                                    path += "/score/" + data.playerId.join(":");
                                }

                                $location.path(path);
                                return;
                                break;
                            case "card":
                                console.log("we have to show a card!");
                                break;
                            case "browser":
                                homeFactory.type = "browser";
                                break;
                            case "seatOrder":
                                $location.path('/rating');
                                return;
                                break;
                            case "black":
                                $location.path('/score');
                                return;
                                break;
                            case "deal":
                                var dealType = "";
                                if (typeof data.dealType !== "undefined") dealType = data.dealType;
                                $location.path('/deals/new/' + dealType);
                                return;
                                break;
                            case "alert":
                                return;
                                break;
                        }
                        $location.path('/home');

                    }
                }
            });
        };
        return homeFactory;
    })
    .factory('GameConf', function (Socket) {
        var gameConf = {};
        gameConf.playerColors = ["not yet set"];
        Socket.on('registerConfirm', function (data) {
            Socket.emit("getGameConf");
            Socket.on('gameConf', function (data) {
                gameConf.playerColors = data.playerColors;
            });
        });
        return gameConf;
    })
    .factory('Status', function ($rootScope, Socket, $location) {

        var emptyPlayer = {playerId: -1, colors: ["weiss", "weiss"]};
        var statusFactory = {};
        statusFactory.player = emptyPlayer;
        statusFactory.otherPlayers = [];
        statusFactory.maxPlayers = 0;
        statusFactory.ratingActive = true;
        statusFactory.joined = false;
        statusFactory.server = Socket.server;
        statusFactory.clientId = -1;
        statusFactory.rating = [];
        statusFactory.gameEvents = [];

        //diese eigenschaft wird hier geführt, da sie im view benötigt wird und sonst im digest-cycle immerwieder neu berrechnet werden muss...
        statusFactory.availablePlayers = [];

        Socket.on('registerConfirm', function (data) {
            if (typeof data != "undefined") statusFactory.clientId = data;
            statusFactory.joinGame();
        });

        Socket.on('status', function (data) {
            console.log(data);
            if (data.otherPlayers) {
                statusFactory.otherPlayers = data.otherPlayers;
                statusFactory.player.score = data.otherPlayers[statusFactory.player.playerId].score;
                statusFactory.player.rank = data.otherPlayers[statusFactory.player.playerId].rank;
                statusFactory.player.timeRank = data.otherPlayers[statusFactory.player.playerId].timeRank;
                statusFactory.availablePlayers = statusFactory.getAvailablePlayers();
            }
            if (data.maxPlayers) statusFactory.maxPlayers = data.maxPlayers;
        });
        Socket.on('gameEvent', function (data) {
            console.log("new gameEvent: " + data);
            statusFactory.gameEvents.push(data)
        });
        Socket.on('inventory', function (data) {
            console.log(data);
            if (data) statusFactory.inventory = data;
        });
        Socket.on('joined', function (data) {
            if (data.player) {
                statusFactory.player = data.player;
                statusFactory.rating = data.rating;
                if (!data.player.joined) {
                    statusFactory.player = emptyPlayer;
                    statusFactory.joined = false;
                } else statusFactory.joined = true;
            }
        });
        Socket.on('reload', function () {
            window.location.reload();
            console.log('X')
        });

        statusFactory.reload = function () {
            window.location.reload();
            console.log('X')
        };
        statusFactory.connected = function () {
            return Socket.connected();
        };
        statusFactory.joinGame = function () {
            Socket.emit("joinGame");
        };
        statusFactory.leaveGame = function () {
            Socket.emit("leaveGame");
        };
        statusFactory.resetPlayer = function () {
            statusFactory.player = emptyPlayer;
            statusFactory.joined = false;
            $rootScope.$digest();
        };
        statusFactory.getOtherPlayers = function () {
            return statusFactory.otherPlayers.filter(function (player) {
                return player.joined && player.playerId !== statusFactory.player.playerId;
            })
        };
        statusFactory.getAvailablePlayers = function () {
            //console.log("x");
            return statusFactory.otherPlayers.filter(function (player) {
                return !player.busy && player.joined && player.playerId !== statusFactory.player.playerId;
            })
        };
        statusFactory.getAllied = function() {
            return statusFactory.otherPlayers[statusFactory.player.playerId].relations.filter(function(rel){
                return rel.type=="alliance"
            }).map(function(rel) {
                return rel.playerIds;
            }).reduce(function (prev, curr) {
                return prev.concat(curr)
            },[]).reduce(function (prev, curr) {
                if (prev.indexOf(curr) < 0 && curr != statusFactory.player.playerId) prev.push(curr);
                return prev;
            },[]);
        };
        return statusFactory;

    })
    .factory('Rating', function (Socket, Status, Home) {
        var ratingFactory = {};
        console.log('111', Home);
        ratingFactory.negPos = Home.displayData.posNeg;

        ratingFactory.rate = function (id, value) {
            Socket.emit("rate", {playerId: id, score: value});
        };

        ratingFactory.posNeg = function (data) {
            console.log('CALLED!');
            if (data) statusFactory.ttest = 'blabla';
        };

        return ratingFactory;
    })
    .factory('fxService', function ($timeout, $interval, ngAudio, Status, Socket) {
        var fxService = {};
        fxService.sound = [];
        fxService.sound["vote"] = ngAudio.load("sounds/tiny-01.mp3");
        fxService.sound["alert"] = ngAudio.load("sounds/tiny-01.mp3");
        fxService.sound["results"] = ngAudio.load("sounds/whoosh3.mp3");
        console.log("Volume " + fxService.sound["results"].volume);
        fxService.sound["card"] = ngAudio.load("sounds/karte1.mp3");
        fxService.sound["rating"] = ngAudio.load("sounds/karte2.mp3");
        fxService.sound["countdown_tick"] = ngAudio.load("sounds/countdown_tick.mp3");
        fxService.sound["scoreDown"] = ngAudio.load("sounds/smashing.mp3");
        fxService.sound["scoreUp"] = ngAudio.load("sounds/glass.mp3");
        fxService.sound["zip"] = ngAudio.load("sounds/zip1.mp3");
        fxService.posAlerts = [];
        fxService.negAlerts = [];
        fxService.countdown = {
            display: false,
            count: -1
        };
        fxService.interval;
        fxService.classes = {};
        fxService.class = {
            background: "transparent"
        };

        fxService.scoreAlert = function (score) {
            console.log("FX-Service got score: " + score);
            if (isNaN(score)) return;
            if (score < 0) {
                score = "" + score;
                fxService.playSound("scoreDown");
                fxService.negAlerts.push(score);
                $timeout(function () {
                    console.log("timeout");
                    fxService.negAlerts.pop()
                }, 2000);
            }
            if (score > 0) {
                console.log(">");
                score = "+" + score;
                fxService.playSound("scoreUp");
                fxService.posAlerts.push(score);
                $timeout(function () {
                    console.log("timeout");
                    fxService.posAlerts.pop();
                }, 2000);
            }
        };
        fxService.startCountdown = function (val, cb) {
            if (fxService.countdown.count > 0) {
                console.log("fxService Kann nur einen Countdown auf einmal...");
                return;
            }
            fxService.countdown.count = val + 1;
            fxService.interval = $interval(function () {
                fxService.countdown.count--;
                fxService.countdown.display = true;
                //console.log("count down to " + fxService.countdown.count);
                fxService.playSound("countdown_tick");
                $timeout(function () {
                    fxService.countdown.display = false;
                }, 300);
                if (cb && fxService.countdown.count == 0) cb.apply();
            }, 1000, val + 1);
        };
        fxService.cancelCountdown = function () {
            console.log("cancelling countdown");
            $interval.cancel(fxService.interval);
            fxService.countdown.count = 0;
        };
        fxService.playSound = function (id) {
            console.log("fxService.play " + id);
            var delay = 0;
            if (id == "results") delay = 250 * Status.player.playerId;
            if (typeof fxService.sound[id] !== "undefined") {
                $timeout(function () {
                    fxService.sound[id].play()
                }, delay);
            }
        };
        fxService.setClass = function (name) {
            console.log("fx.setClass " + name);
            if (typeof fxService.classes[name] == "undefined") fxService.classes[name] = false;
            fxService.classes[name] ^= true;
            console.log("now " + fxService.classes[name]);
        };
        Socket.on("fx", function (fx) {
            switch (fx.type) {
                case "flashAndSound":
                    fxService.playSound(fx.sound);
                    fxService.flash(fx.color, fx.time);
                    break;
            }
        });
        fxService.flash = function (col, time) {
            console.log("flash");
            fxService.class.background = col;
            $timeout(function () {
                fxService.class.background = "transparent";
            }, time)
        };
        return fxService;
    })
    .factory('DealFactory', function (Socket, Status, rfc4122, $location) {
        // deal.states entspricht ["just opened", "waiting for answer", "have to reply", "confirmed", "denied"]
        var dealFactory = {};
        dealFactory.deals = {};
        Socket.on('deal', function (deal) {
            if (dealFactory.deals.hasOwnProperty(deal.id)) {
                dealFactory.deals[deal.id].state = deal.state;
                dealFactory.deals[deal.id].messages = deal.messages;
            }
            else dealFactory.deals[deal.id] = deal;
            $location.path("/deals/" + deal.id);
        });
        Socket.on('dealStatus', function (deals) {
            console.log("dealStatus coming in");
            var activeDealId = -1;
            for (var dealId in deals) if (deals.hasOwnProperty(dealId)) {
                if (dealFactory.deals.hasOwnProperty(dealId)) {
                    dealFactory.deals[dealId].state = deals[dealId].state;
                    dealFactory.deals[dealId].messages = deals[dealId].messages;
                }
                else dealFactory.deals[dealId] = deals[dealId];
                if (deals[dealId].state <= 2) {
                    console.log("set activDeal");
                    activeDealId = dealId;
                }
            }
            if (activeDealId != -1) $location.path("/deals/" + activeDealId);
        });

        dealFactory.addDeal = function (subject, player1Id) {
            console.log("new Deal");
            var added = {
                id: rfc4122.v4(),
                subject: subject,
                player0Id: Status.player.playerId,
                player1Id: player1Id,
                state: 0,
                messages: [],
                maxMessages: 2
            };
            dealFactory.deals[added.id] = added;
            return added.id;
        };
        dealFactory.deleteDeal = function (deal) {
            console.log("delete deal " + deal.id);
            delete dealFactory.deals[deal.id];
            $location.path("/deals/new");
        };
        dealFactory.sendMessage = function (deal, message) {
            //wenn gecancelled wird: deal löschen ODER wenn er schon state > 0 auch eine deny-message machen
            if (message.type === "cancel") {
                if (deal.state === 0) {
                    dealFactory.deleteDeal(deal);
                    return;
                }
                else message.type = "deny";
            }

            //wenn der value einer request-message gleich dem value der letzten message im deal ist, wird ein confirm daraus gemacht
            if (message.type === "request") if (deal.messages.length > 0) if (message.value == deal.messages[deal.messages.length - 1].value) message.type = "confirm";

            deal.messages.push({playerId: Status.player.playerId, type: message.type, value: message.value});
            if (message.type === "confirm") deal.state = 3;
            if (message.type === "deny") deal.state = 4;
            if (deal.state === 0 || deal.state === 2) {
                deal.state = 1;
            }
            else if (deal.state === 1) {
                deal.state = 2;
            }
            Socket.emit("deal", deal);
        };

        dealFactory.getMyDealState = function (deal) {
            if (deal === null) return 0;
            var myState = deal.state;
            if (deal.player1Id == Status.player.playerId) {
                if (deal.state == 1) myState = 2;
                if (deal.state == 2) myState = 1;
            }
            return myState;
        };
        return dealFactory;
    })
;
