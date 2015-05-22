(function () {
    'use strict';

    angular.module('playerAppServices', [])
        .factory('Home', function (Socket, $location, fxService, Status, $timeout, playerColors, gettextCatalog) {
            var homeFactory = {};
            homeFactory.displayData = {};
            homeFactory.type = "vote";
            homeFactory.labels = [];
            homeFactory.options = null;
            homeFactory.voteId = -1;
            homeFactory.checked = 0;
            homeFactory.showGo = false;
            homeFactory.done = false;
            homeFactory.timeout;

            homeFactory.doneTask = function () {
                homeFactory.done = true;
                homeFactory.cancelCountdown();

                console.log(homeFactory.done);
            };

            homeFactory.timedVote = function (cb) {
                if (homeFactory.timeout) {
                    console.log("new timeout - cancel old timeout!");
                    $timeout.cancel(homeFactory.timeout);
                }
                //TODO: wenn eine nummer-eingabe-abstimmung läuft sollte die eingegebene nummer, wenn auch noch nicht gesendet, verwendet werden
                if (homeFactory.time === 0) {
                    return;
                }
                if (homeFactory.time < 12) {
                    fxService.startCountdown(homeFactory.time, cb);
                }
                else {
                    homeFactory.timeout = $timeout(function () {
                        fxService.startCountdown(12, cb);
                    }, (homeFactory.time - 12) * 1000);
                }
            };
            homeFactory.vote = function () {
                homeFactory.voteChoiceText = homeFactory.options.filter(function (opt) {
                    return opt.checked;
                }).map(function (opt) {
                    return opt.text;
                });
                homeFactory.voteChoice = homeFactory.options.filter(function (opt) {
                    return opt.checked;
                }).map(function (opt) {
                    return opt.value;
                });
                $location.path("/voteConfirm");
            };
            homeFactory.confirmVote = function () {
                homeFactory.done = true;
                if (typeof homeFactory.voteChoice === "undefined") {
                    homeFactory.voteChoice = [];
                }
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

            homeFactory.freeze = function () {
                Socket.emit("score", {
                    playerId: Status.player.playerId,
                    score: -1,
                    reason: "timeout",
                    otherPlayerId: Status.player.playerId
                });
                $location.path("freeze");
            };

            homeFactory.cancelCountdown = function () {

                if (homeFactory.timeout) {
                    console.log("cancel timeout!");
                    $timeout.cancel(homeFactory.timeout);
                }
                fxService.cancelCountdown();
            };

            homeFactory.start = function () {
                Socket.on('display', function (data) {
                    if (data.type !== "alert") {
                        homeFactory.done = false;
                    }
                    console.log("new display: " + data.type);
                    homeFactory.cancelCountdown();
                    homeFactory.labels = [];
                    homeFactory.icon = "";
                    if (data) {
                        homeFactory.text = data.text;
                        //homeFactory.showGo = false;
                        if (typeof data.showGo !== "undefined") {
                            homeFactory.showGo = data.showGo;
                        }
                        homeFactory.displayData = data;
                        if (data.type) {
                            if (!data.silent && data.type !== "alert") {
                                fxService.playSound(data.type);
                            }
                            switch (data.type) {
                                case "agreement":
                                    homeFactory.icon = "alliance";
                                    showVote(data);
                                    break;
                                case "roulette":
                                case "vote":
                                    showVote(data);
                                    break;
                                case "results":
                                    showResults(data);
                                    break;
                                case "rating":
                                    showRating(data);
                                    break;
                                case "card":
                                    showCard();
                                    break;
                                case "browser":
                                    homeFactory.type = "browser";
                                    break;
                                case "black":
                                    homeFactory.type = "card";
                                    $location.path('/black');
                                    break;
                                case "deal":
                                    showDeal(data);
                                    break;
                                case "showAssholes":
                                    homeFactory.assholeData = data.data[Status.player.playerId];
                                    homeFactory.assholeOptions = data.assholeOptions;
                                    $location.path('/assholes');
                                    break;
                                case "slideshow":
                                    homeFactory.slideshowImages = data.images;
                                    $location.path('/slideshow');
                                    break;
                                case "alert":
                                    showAlert(data);
                                    break;
                            }
                        }
                    }
                });
            };

            function showAlert(data) {
                switch (data.param) {
                    case 0:
                        homeFactory.cancelCountdown();
                        break;
                    case 1:
                        if (!homeFactory.done) {
                            fxService.playSound('alert');
                        }
                        break;
                    case 2:
                        console.log(homeFactory.type);
                        if (["agreement", "rating", "vote", "deal"].indexOf(homeFactory.type) === -1) {
                            return;
                        }
                        homeFactory.time = 12;
                        if (!homeFactory.done) {
                            if (homeFactory.type === "vote") {
                                homeFactory.timedVote(homeFactory.confirmVote);
                            }
                            else {
                                homeFactory.timedVote(homeFactory.freeze);
                            }
                        }
                        break;
                }
            }

            function showResults(data) {
                var resultType = data.resultType;
                var result = data.data;

                var labels = [];
                var resData = [];
                homeFactory.correctAnswer = "";
                homeFactory.ratedVote = result.ratedVote;
                //"::::" erzeugt zwei Zeilenumbrüche in der Darstellung in der playerApp
                if (resultType === "numberStats") {
                     //send stats as array: [sum, avg]
                    resData = [
                       // result.sum,
                        f(result.sum),
                        f(result.average),
                        f(result.minVal),
                        f(result.maxVal)
                    ];
                }
                else {
                    result.voteOptions.forEach(function (option) {
                        if (option.correctAnswer) {
                            homeFactory.correctAnswer = option.text;
                        }
                        if (data.data.dataSource === "positivePlayerScore") {
                            labels.push(option.playercolor + ': ' + option.percent + '% (' + option.result + ' ' + gettextCatalog.getPlural(option.result, 'point', 'points') + ')');
                        } else {
                            var t;
                            if (typeof option.text === 'undefined') {
                                console.warn('option.text is undefined!');
                                return;
                            }
                            if (option.text === null) {
                                console.warn('option.text is null!');
                                return;
                            }
                            if (option.text.length > 100) {
                                t = option.text.substr(0, 100) + '...';
                            }
                            else {
                                t = option.text;
                            }
                            labels.push(t + ' <br/><strong>' + option.percent + '% (' + option.votes + ' ' + gettextCatalog.getPlural(option.votes, 'vote', 'votes') + ')</strong>');
                        }
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
                if (resultType === "firstVote") {
                    resData = result.votes[0].playerId;
                    console.log(resData);
                }

                homeFactory.resultType = resultType;
                if (homeFactory.resultType === 'Bar' || homeFactory.resultType === 'Line') {
                    homeFactory.data = [resData];
                }
                else {
                    homeFactory.data = resData;
                }
                homeFactory.labels = labels;
                homeFactory.votelast = "result";
                homeFactory.type = "result";
                if (data.resultColors) {
                    if (data.resultColors === "playerColors") {
                        homeFactory.resultColors = [];
                        result.voteOptions.forEach(function (option) {
                            homeFactory.resultColors.push(playerColors[option.value]);
                        });
                    }
                }
                $location.path("/results");
            }

            function showVote(data) {
                homeFactory.type = "vote";
                homeFactory.voteType = data.voteType;
                homeFactory.options = data.voteOptions || [{value: 0}];
                if (homeFactory.voteType === "enterNumber") {
                    homeFactory.options[0].checked = true;
                }
                homeFactory.limit = homeFactory.voteType === "customOptions" ? 1 : data.voteMulti;
                homeFactory.checked = 0;
                homeFactory.votelast = "vote";
                homeFactory.pollId = data.pollId;
                homeFactory.ratedVote = data.ratedVote;
                homeFactory.time = parseInt(data.time);
                homeFactory.timedVote(homeFactory.confirmVote);
                $location.path("/vote");
            }

            function showRating(data) {
                homeFactory.type = "rating";
                homeFactory.time = parseInt(data.time);
                homeFactory.timedVote(homeFactory.freeze);
                var path = "/rating";
                if (data.ratingType === "allTeams") {
                    path += "/player";
                    if (data.posNeg === "+1") {
                        path += "/1";
                    }
                    else {
                        path += "/-1";
                    }
                }
                if (data.ratingType === "oneTeam") {
                    if (data.playerId) {
                        path += "/score/" + data.playerId.join(":");
                    } else {
                        path += "/score/"
                    }
                }
                $location.path(path);
            }

            function showCard() {
                homeFactory.type = "card";
                console.log("we have to show a card!");
                $location.path('/card');
            }

            function showDeal(data) {
                homeFactory.type = "deal";
                homeFactory.time = parseInt(data.time);
                homeFactory.timedVote(homeFactory.freeze);
                $location.path('/deal');
            }
            function f(s) {
                return parseFloat(s).toLocaleString(
                        gettextCatalog.currentLanguage,
                        {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2
                        }) + ' ' + gettextCatalog.getString('€');
            }

            return homeFactory;
        })
        .factory('Status', function ($rootScope, Socket, $location) {

            var emptyPlayer = {playerId: -1, colors: ["weiss", "weiss"]};
            var statusFactory = {};
            statusFactory.player = emptyPlayer;
            statusFactory.otherPlayers = [];
            statusFactory.otherJoinedPlayers = [];
            statusFactory.maxPlayers = 0;
            statusFactory.ratingActive = true;
            statusFactory.joined = false;
            statusFactory.server = Socket.server;
            statusFactory.clientId = -1;
            statusFactory.rating = [];
            statusFactory.gameEvents = [];
            statusFactory.playerOnTurn = null;
            statusFactory.gameEventTypes = [];
            statusFactory.playerAppIcons = [];

            //diese eigenschaft wird hier geführt, da sie im view
            //benötigt wird und sonst im digest-cycle immerwieder neu
            //berrechnet werden muss...
            statusFactory.availablePlayers = [];

            Socket.on('registerConfirm', function (data) {
                if (typeof data !== "undefined") {
                    statusFactory.clientId = data;
                }
                statusFactory.joinGame();
            });

            Socket.on('status', function (data) {
                //console.log(data);
                if (data.otherPlayers) {
                    statusFactory.otherPlayers = data.otherPlayers;
                    statusFactory.player.score = data.otherPlayers[statusFactory.player.playerId].score;
                    statusFactory.player.rank = data.otherPlayers[statusFactory.player.playerId].rank;
                    statusFactory.player.timeRank = data.otherPlayers[statusFactory.player.playerId].timeRank;
                    statusFactory.availablePlayers = statusFactory.getAvailablePlayers();
                    statusFactory.playerOnTurn = statusFactory.getPlayerOnTurn();
                    statusFactory.otherJoinedPlayers = statusFactory.getOtherPlayers();
                }
                if (data.maxPlayers) {
                    statusFactory.maxPlayers = data.maxPlayers;
                }
            });
            Socket.on('gameEvent', function (data) {
                console.log("new gameEvent: " + data);
                statusFactory.gameEvents.push(data);
                if (statusFactory.gameEventTypes.indexOf(data.type) === -1) {
                    statusFactory.gameEventTypes.push(data.type);
                }
                if (data.type === "insurance") {
                    statusFactory.playerAppIcons.push({name: "deal", playerId: data.value});
                }
                if (data.type === "alliance") {
                    var playerId = data.value.filter(function(id){
                        return id !== statusFactory.player.playerId;
                    })[0];
                    statusFactory.playerAppIcons.push({name: "alliance", playerId: playerId});
                }


            });
            Socket.on('inventory', function (data) {
                console.log(data);
                if (data) {
                    statusFactory.inventory = data;
                }
            });
            Socket.on('joined', function (data) {
                if (data.player) {
                    statusFactory.player = data.player;
                    statusFactory.rating = data.rating;
                    if (!data.player.joined) {
                        statusFactory.player = emptyPlayer;
                        statusFactory.joined = false;
                    }
                    else {
                        statusFactory.joined = true;
                    }
                }
            });
            Socket.on('reload', function () {
                window.location.reload();
            });

            statusFactory.reload = function () {
                window.location.reload();
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
                });
            };
            statusFactory.getAvailablePlayers = function () {
                return statusFactory.otherPlayers.filter(function (player) {
                    return !player.busy && player.joined && player.playerId !== statusFactory.player.playerId;
                });
            };
            statusFactory.getAllied = function () {
                return statusFactory.otherPlayers[statusFactory.player.playerId].relations.filter(function (rel) {
                    return rel.type === "alliance";
                }).map(function (rel) {
                    return rel.playerIds;
                }).reduce(function (prev, curr) {
                    return prev.concat(curr);
                }, []).reduce(function (prev, curr) {
                    if (prev.indexOf(curr) < 0 && curr !== statusFactory.player.playerId) {
                        prev.push(curr);
                    }
                    return prev;
                }, []);
            };
            statusFactory.getPlayerOnTurn = function () {
                var x = statusFactory.otherPlayers.filter(function (player) {
                    return player.onTurn === true;
                }).map(function (player) {
                    return player.playerId;
                });
                if (x.length > 0) {
                    return x[0];
                }
                else {
                    return null;
                }
            };
            return statusFactory;

        })
        .factory('Rating', function (Socket, Status, Home) {
            var ratingFactory = {};
            ratingFactory.negPos = Home.displayData.posNeg;

            ratingFactory.rate = function (id, value) {
                Socket.emit("rate", {playerId: id, score: value});
            };

            return ratingFactory;
        })
        .factory('fxService', function ($timeout, $interval, ngAudio, Status, Socket) {
            var fxService = {};
            fxService.sound = [];
            fxService.sound.vote = ngAudio.load("sounds/tiny-01.mp3");
            fxService.sound.alert = ngAudio.load("sounds/alarm.mp3");
            fxService.sound.results = ngAudio.load("sounds/whoosh3.mp3");
            fxService.sound.card = ngAudio.load("sounds/karte1.mp3");
            fxService.sound.rating = ngAudio.load("sounds/karte2.mp3");
            fxService.sound.other = ngAudio.load("sounds/fanfare2.mp3");
            fxService.sound.win = ngAudio.load("sounds/fanfare1.mp3");
            fxService.sound.countdown_tick = ngAudio.load("sounds/countdown_tick.mp3");
            fxService.sound.scoreDown = ngAudio.load("sounds/smashing.mp3");
            fxService.sound.scoreUp = ngAudio.load("sounds/glass.mp3");
            fxService.sound.zip = ngAudio.load("sounds/zip1.mp3");
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
                if (isNaN(score)) {
                    return;
                }
                if (score < 0) {
                    score = "" + score;
                    fxService.playSound("scoreDown");
                    fxService.negAlerts.push(score);
                    $timeout(function () {
                        console.log("timeout");
                        fxService.negAlerts.pop();
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
                    if (fxService.countdown.count < 8) {
                        fxService.playSound("countdown_tick");
                    }
                    $timeout(function () {
                        fxService.countdown.display = false;
                    }, 300);
                    if (cb && fxService.countdown.count === 0) {
                        cb.apply();
                    }
                }, 1000, val + 1);
            };
            fxService.cancelCountdown = function () {
                console.log("cancelling countdown");
                $interval.cancel(fxService.interval);
                fxService.countdown.count = 0;
            };
            fxService.playSound = function (id) {
                console.log("fxService.play " + id);
                if (typeof fxService.sound[id] === "undefined") {
                    id = "other";
                }
                var delay = 0;
                if (id === "results") {
                    delay = 250 * Status.player.playerId;
                }
                if (typeof fxService.sound[id] !== "undefined") {
                    $timeout(function () {
                        fxService.sound[id].play();
                    }, delay);
                }
            };
            fxService.setClass = function (name) {
                console.log("fx.setClass " + name);
                if (typeof fxService.classes[name] === "undefined") {
                    fxService.classes[name] = false;
                }
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
                }, time);
            };
            return fxService;
        })
        .factory('DealFactory', function (Socket, Status, $location, Home, gettextCatalog) {
            var dealFactory = {};
            dealFactory.deal = {
                id: ""
            };
            dealFactory.message = "";

            Socket.on("deal", function (deal) {
                switch (deal.status) {
                    case "request":
                        dealFactory.deal = deal;
                        if (parseInt(deal.player0Id) === Status.player.playerId) {
                            $location.path("/deal/wait/" + deal.player1Id);
                        } else {
                            $location.path("/deal/answer/" + deal.player0Id);
                        }
                        break;
                    case "confirm":
                        Home.doneTask();
                        if (parseInt(deal.player0Id) === Status.player.playerId) {
                            $location.path("/deal/finish/" + deal.player1Id);
                        } else {
                            $location.path("/deal/finish/" + deal.player0Id);
                        }
                        break;
                    case "deny":
                        dealFactory.message = gettextCatalog.getString("The deal was denied");
                        $location.path("/deal");
                        break;
                    case "busy":
                        dealFactory.message = gettextCatalog.getString("The other team is busy");
                        $location.path("/deal");
                        break;
                }
            });
            dealFactory.requestDeal = function (playerId) {
                console.log("request deal with " + playerId);
                Socket.emit("deal", {player0Id: Status.player.playerId, player1Id: playerId, status: "request"});
            };
            dealFactory.denyDealing = function () {
                console.log("denying deals at all");
                Home.doneTask();
                Socket.emit("deal", {status: "denyDealing", player0Id: Status.player.playerId});
            };
            dealFactory.confirm = function () {
                console.log("comfirm deal");
                dealFactory.deal.status = "confirm";
                Socket.emit("deal", dealFactory.deal);
            };
            dealFactory.deny = function () {
                console.log("deny deal");
                dealFactory.deal.status = "deny";
                Socket.emit("deal", dealFactory.deal);
            };
            return dealFactory;
        });

})();
