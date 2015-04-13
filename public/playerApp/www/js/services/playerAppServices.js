angular.module('playerAppServices', [])
    .factory('colors', function () {
        return {
            rot: {'background-color': '#FF0000', 'color': '#555555'},
            gelb: {'background-color': '#FFFF00', 'color': '#555555'},
            blau: {'background-color': '#0000FF', 'color': '#BBBBBB'},
            weiss: {'background-color': '#FFFFFF', 'color': '#555555'},
            gruen: {'background-color': '#00FF00', 'color': '#555555'},
            pink: {'background-color': '#FF88FF', 'color': '#555555'},
            schwarz: {'background-color': '#000000', 'color': '#BBBBBB'}
        }
    })
    .factory('borderColors', function () {
        var width = "5px";
        return {
            rot: {'border': width + ' solid #FF0000'},
            gelb: {'border': width + ' solid #FFFF00'},
            blau: {'border': width + ' solid #0000FF'},
            weiss: {'border': width + ' solid #FFFFFF'},
            gruen: {'border': width + ' solid #00FF00'},
            pink: {'border': width + ' solid #FF88FF'},
            schwarz: {'border': width + ' solid #000000'}
        }
    })
    .factory('playerColors', function () {
        return [
            ["pink", "schwarz"],
            ["gelb", "gruen"],
            ["rot", "blau"],
            ["gelb", "pink"],
            ["rot", "gruen"],
            ["blau", "pink"],
            ["rot", "gelb"],
            ["gelb", "blau"],
            ["gruen", "weiss"]
        ];
        /*
         return [
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
    })
    .factory('itemTypes', function () {
        return {
            'card': 'Card',
            'vote': 'Vote',
            'rating': 'Rating',
            'result': 'Result'
        }
    })
    .factory('Home', function (Socket, $location, fxService, Status, $timeout) {
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
            Socket.emit({
                type: "vote",
                choice: homeFactory.voteChoice,
                text: homeFactory.voteChoiceText,
                playerId: Status.player.playerId,
                pollId: homeFactory.pollId
            });
            $location.path("/voteFinished");
        };

        Socket.on('display', function (event) {
            var data = JSON.parse(event.data).data;
            console.log("new display: " + data.type);
            homeFactory.type = "card";
            homeFactory.labels = [];
            homeFactory.options = null;
            if (data) {
                if (!!data.text) homeFactory.text = data.text.split("::");
                //homeFactory.showGo = false;
                if (typeof data.showGo != "undefined") homeFactory.showGo = data.showGo;
                homeFactory.displayData = data;
                if (data.type) {
                    switch (data.type) {
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
                            fxService.playSound(0);
                            $location.path("/vote");
                            return;
                            break;
                        case "results":
                            var resultType = data.resultType;
                            var result = data.data;
                            var msg = data.text;

                            var labels = [];
                            var resData = [];
                            //"::::" erzeugt zwei Zeilenumbrüche in der Darstellung in der playerApp
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
                            homeFactory.resultType = resultType;
                            (homeFactory.resultType == 'Bar' || homeFactory.resultType == 'Line') ? homeFactory.data = [resData] : homeFactory.data = resData;
                            homeFactory.labels = labels;
                            homeFactory.votelast = "result";
                            homeFactory.type = "result";
                            homeFactory.resultColor = data.resultColor;
                            break;
                        case "rating":
                            homeFactory.type = "rating";
                            $location.path("/rating");
                            return;
                            break;
                        case "card":
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
                        case "alert":
                            fxService.playSound(0);
                            return;
                            break;
                    }
                    $location.path('/home');

                }
            }
        });
        return homeFactory;
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

        Socket.on('registerConfirm', function (event) {
            var data = JSON.parse(event.data).data;
            if (typeof data != "undefined") statusFactory.clientId = data;
            statusFactory.joinGame();
        });

        Socket.on('status', function (event) {
            var data = JSON.parse(event.data).data;
            console.log(data);
            if (data.otherPlayers) {
                statusFactory.otherPlayers = data.otherPlayers;
                statusFactory.player.score = data.otherPlayers[statusFactory.player.playerId].score;
                statusFactory.player.rank = data.otherPlayers[statusFactory.player.playerId].rank;
                statusFactory.player.timeRank = data.otherPlayers[statusFactory.player.playerId].timeRank;
            }
            if (data.maxPlayers) statusFactory.maxPlayers = data.maxPlayers;
        });
        Socket.on('inventory', function (event) {
            var data = JSON.parse(event.data).data;
            console.log(data);
            if (data) statusFactory.inventory = data;
        });
        Socket.on('joined', function (event) {
            var data = JSON.parse(event.data).data;
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
            Socket.emit({type: "joinGame", data: {}});
        };
        statusFactory.leaveGame = function () {
            Socket.emit({type: "leaveGame", data: {}});
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
        return statusFactory;

    })
    .factory('Rating', function (Socket, Status, Home) {
        var ratingFactory = {};
        console.log('111', Home);
        ratingFactory.negPos = Home.displayData.posNeg;

        ratingFactory.rate = function (id, value) {
            // TODO
            // Socket.emit({type: "rate", data: {rate: ratingFactory.myRatings, playerId: Status.player.playerId}});
        };

        ratingFactory.posNeg = function(event) {
            console.log('CALLED!');
            var data = JSON.parse(event.data).data;
            if (data) statusFactory.ttest = 'blabla';
        };

        return ratingFactory;
    })
    .factory('Chat', function ($rootScope, Socket, Status) {

        var chatFactory = {};
        chatFactory.messages = [[[0, "hallo"], [1, "wie gehts?"]], [[0, "hallo"], [1, "wie gehts?"]]];
        chatFactory.messages = [];
        chatFactory.newCntPerPlayer = [];
        chatFactory.newCnt = 0;

        Socket.on('chat', function (event) {
            var data = JSON.parse(event.data).data;
            var playerId = data.playerId;
            if (typeof chatFactory.messages[playerId] == "undefined") chatFactory.messages[playerId] = [];
            chatFactory.messages[playerId].unshift([1, data.message]);
            if (typeof chatFactory.newCntPerPlayer[playerId] == "undefined") chatFactory.newCntPerPlayer[playerId] = 1;
            else  chatFactory.newCntPerPlayer[playerId]++;
            chatFactory.newCnt++;
            $rootScope.$broadcast("newChatMessage", chatFactory.newCnt);
        });

        chatFactory.chat = function (pid, msg) {
            Socket.emit({type: "chat", data: {sender: Status.player.playerId, recipient: pid, message: msg}});
            if (typeof chatFactory.messages[pid] == "undefined") chatFactory.messages[pid] = [];
            chatFactory.messages[pid].unshift([0, msg]);
        };

        chatFactory.messagesRead = function (playerId) {
            console.log("gelesen");
            chatFactory.newCnt -= chatFactory.newCntPerPlayer[playerId];
            chatFactory.newCntPerPlayer[playerId] = 0;
            //da newCnt ein einzelner wert ist, muss ich den broadcasten. die arraywerte im perplayer-array werden automatisch gebindet...
            $rootScope.$broadcast("newChatMessage", chatFactory.newCnt);
        };
        return chatFactory;
    })
    .factory('fxService', function ($timeout, $interval, ngAudio) {
        var fxService = {};
        fxService.sound = [];
        fxService.sound[0] = ngAudio.load("sounds/tiny-01.mp3");    //vote incoming
        fxService.sound[1] = ngAudio.load("sounds/smashing.mp3");   //scoreDown
        fxService.sound[2] = ngAudio.load("sounds/glass.mp3");      //scoreUp
        fxService.posAlerts = [];
        fxService.negAlerts = [];
        fxService.countdown = {
            display: false,
            count: -1
        };
        fxService.interval;

        fxService.scoreAlert = function (score) {
            console.log("FX-Service got score: " + score);
            if (isNaN(score)) return;
            if (score < 0) {
                score = "" + score;
                fxService.playSound(1);
                fxService.negAlerts.push(score);
                $timeout(function () {
                    console.log("timeout");
                    fxService.negAlerts.pop()
                }, 2000);
            }
            if (score > 0) {
                console.log(">");
                score = "+" + score;
                fxService.playSound(2);
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
                //console.log("count down to "+fxService.countdown.count);
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
            fxService.sound[id].play();
        };
        return fxService;
    })
    .factory('DealFactory', function (Socket, Status, rfc4122) {
        var dealFactory = {};
        var newDeal = {
            id: null,
            subject: null,
            player0Id: Status.player.playerId,
            player1Id: null,
            state: null,
            messages: []
        };
        dealFactory.active = {
            deal: null
        };
        dealFactory.deals = {
            ab: {subject: "alliance", player0Id: Status.player.playerId, player1Id: 1, state: 0, messages: []},
            fg: {subject: "alliance", player0Id: Status.player.playerId, player1Id: 1, state: 1, messages: []},
            ft: {subject: "versicherung", player0Id: Status.player.playerId, player1Id: 1, state: 0, messages: []}
        };
        Socket.on('deal', function (event) {
            var deal = JSON.parse(event.data).data;
            if (dealFactory.deals.hasOwnProperty(deal.id)) {
                dealFactory.deals[deal.id].state = deal.state;
                dealFactory.deals[deal.id].messages = deal.messages;
            }
            else dealFactory.deals[deal.id] = deal;
        });
        dealFactory.addDeal = function (subject) {
            var added = angular.copy(newDeal);
            added.subject = subject;
            added.state = 0;
            added.id = rfc4122.v4();
            dealFactory.deals[added.id] = added;
            dealFactory.active.deal = added;
        };
        dealFactory.sendMessage = function (type, value) {
            dealFactory.active.deal.messages.push({playerId: Status.player.playerId, type: type, value: value});
            if (type === "confirm") dealFactory.active.deal.state = 3;
            if (type === "deny") dealFactory.active.deal.state = 4;
            if (dealFactory.active.deal.state === 0 || dealFactory.active.deal.state === 2) {
                dealFactory.active.deal.state = 1;
            }
            else if (dealFactory.active.deal.state === 1) {
                dealFactory.active.deal.state = 2;
            }
            Socket.emit({type: "deal", data: dealFactory.active.deal});
        };
        dealFactory.getMyDealState = function (deal) {
            if (deal === null) return 0;
            var myState = deal.state;
            if (deal.player1Id === Status.player.playerId) {
                if (deal.state === 1) myState = 2;
                if (deal.state === 2) myState = 1;
            }
            return myState;
        };
        return dealFactory;
    })
;
