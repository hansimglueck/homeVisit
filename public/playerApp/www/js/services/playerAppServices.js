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
            rot: {'border': width+' solid #FF0000'},
            gelb: {'border': width+' solid #FFFF00'},
            blau: {'border': width+' solid #0000FF'},
            weiss: {'border': width+' solid #FFFFFF'},
            gruen: {'border': width+' solid #00FF00'},
            pink: {'border': width+' solid #FF88FF'},
            schwarz: {'border': width+' solid #000000'}
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

        homeFactory.timedVote = function() {
            //TODO: wenn eine nummer-eingabe-abstimmung läuft sollte die eingegebene nummer, wenn auch noch nicht gesendet, verwendet werden
            if (homeFactory.time == 0) return;
            if (homeFactory.time < 10) {
                fxService.startCountdown(homeFactory.time, homeFactory.vote);
            }
            else {
                homeFactory.timeout = $timeout(function(){
                    fxService.startCountdown(10, homeFactory.vote);
                }, (homeFactory.time-10)*1000);
             }
        };

        homeFactory.vote = function() {
            homeFactory.voteChoiceText = homeFactory.options.filter(function(opt){return opt.checked}).map(function(opt){return opt.text});
            homeFactory.voteChoice = homeFactory.options.filter(function(opt){return opt.checked}).map(function(opt){return opt.value});
            $location.path("/voteConfirm");
        };
        homeFactory.confirmVote = function() {
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
                            $location.path("/vote");
                            return;
                            break;
                        case "result":
                            homeFactory.displayType = data.displayType;
                            homeFactory.labels = data.labels;
                            (homeFactory.displayType == 'Bar' || homeFactory.displayType == 'Line') ? homeFactory.data = [data.data] : homeFactory.data = data.data;
                            homeFactory.votelast = "result";
                            homeFactory.type = "result";
                            homeFactory.resultColor = data.resultColor;
                            console.log(homeFactory.displayType);
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

        Socket.on('reload', function() {
            window.location.reload();
            console.log('X')
        });


        statusFactory.reload = function() {
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
        return statusFactory;


    })
    .factory('Rating', function (Socket, Status) {

        var ratingFactory = {};
        ratingFactory.myRatings = [];
        ratingFactory.avgRatings = [];
        ratingFactory.maxRating = 8;

        Socket.on('rates', function (event) {
            var data = JSON.parse(event.data).data;
            ratingFactory.avgRatings = data.avgRatings;
            console.log(ratingFactory.avgRatings);
        });

        Socket.on('joined', function(event) {
            var data = JSON.parse(event.data).data;
            for (var i = 0; i < data.rating.length; i++) {
                ratingFactory.myRatings[i] = data.rating[i];
            }
        });

        Socket.on('status', function(event) {
            var data = JSON.parse(event.data).data;
            console.log(data.avgRatings);
            for (var i = 0; i < data.avgRatings.length; i++) {
                ratingFactory.avgRatings[i] = data.avgRatings[i];
            }
            console.log(ratingFactory.avgRatings);
        });

        ratingFactory.rate = function (id, diff) {
            ratingFactory.myRatings[id] += diff;
            Socket.emit({type: "rate", data: {rate: ratingFactory.myRatings, playerId: Status.player.playerId}});
        };

        ratingFactory.fillMyRatings = function () {
            for (var i = 0; i < Status.maxPlayers; i++) {
                ratingFactory.myRatings[i] = ratingFactory.myRatings[i] ? ratingFactory.myRatings[i] : ratingFactory.maxRating / 2;
            }
        };
        ratingFactory.setMyRatings = function(rates) {
            for (var i = 0; i < rates.length; i++) {
                ratingFactory.myRatings[i] = rates[i];
            }
        };

        ratingFactory.getMyRatings = function () {
            return ratingFactory.myRatings;
        };
        ratingFactory.getAvgRatings = function () {
            return ratingFactory.avgRatings;
        };

        return ratingFactory;
    })
    .factory('Chat', function ($rootScope, Socket, Status) {

        var chatFactory = {};
        chatFactory.messages = [[[0,"hallo"],[1,"wie gehts?"]],[[0,"hallo"],[1,"wie gehts?"]]];
        chatFactory.messages = [];
        chatFactory.newCntPerPlayer = [];
        chatFactory.newCnt = 0;

        Socket.on('chat', function (event) {
            var data = JSON.parse(event.data).data;
            var playerId = data.playerId;
            if (typeof chatFactory.messages[playerId] == "undefined") chatFactory.messages[playerId] = [];
            chatFactory.messages[playerId].unshift([1,data.message]);
            if (typeof chatFactory.newCntPerPlayer[playerId] == "undefined") chatFactory.newCntPerPlayer[playerId] = 1;
            else  chatFactory.newCntPerPlayer[playerId]++;
            chatFactory.newCnt++;
            $rootScope.$broadcast("newChatMessage", chatFactory.newCnt);
        });

        chatFactory.chat = function(pid, msg) {
            Socket.emit({type: "chat", data:{sender: Status.player.playerId, recipient: pid, message: msg}});
            if (typeof chatFactory.messages[pid] == "undefined") chatFactory.messages[pid] = [];
            chatFactory.messages[pid].unshift([0,msg]);
        };

        chatFactory.messagesRead = function(playerId) {
            console.log("gelesen");
            chatFactory.newCnt -= chatFactory.newCntPerPlayer[playerId];
            chatFactory.newCntPerPlayer[playerId] = 0;
            //da newCnt ein einzelner wert ist, muss ich den broadcasten. die arraywerte im perplayer-array werden automatisch gebindet...
            $rootScope.$broadcast("newChatMessage", chatFactory.newCnt);
        };
        return chatFactory;
    })
    .factory('fxService', function ($timeout, $interval, ngAudio){
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

        fxService.scoreAlert = function(score) {
            console.log("FX-Service got score: "+score);
            if(isNaN(score)) return;
            if (score < 0) {
                score = ""+score;
                fxService.playSound(1);
                fxService.negAlerts.push(score);
                $timeout(function(){console.log("timeout");fxService.negAlerts.pop()},2000);
            }
            if (score > 0) {
                console.log(">");
                score = "+"+score;
                fxService.playSound(2);
                fxService.posAlerts.push(score);
                $timeout(function(){console.log("timeout");fxService.posAlerts.pop();},2000);
            }
        };
        fxService.startCountdown = function(val, cb) {
            if (fxService.countdown.count > 0) { console.log("fxService Kann nur einen Countdown auf einmal..."); return; }
            fxService.countdown.count = val+1;
            fxService.interval = $interval(function(){
                fxService.countdown.count--;
                fxService.countdown.display=true;
                //console.log("count down to "+fxService.countdown.count);
                $timeout(function(){
                    fxService.countdown.display=false;
                },300);
                if (cb && fxService.countdown.count==0) cb.apply();
            },1000, val+1);
        };
        fxService.cancelCountdown = function() {
            console.log("cancelling countdown");
            $interval.cancel(fxService.interval);
            fxService.countdown.count = 0;
        };
        fxService.playSound = function(id) {
            fxService.sound[id].play();
        };
        return fxService;
    })
;
