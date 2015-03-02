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
    .factory('playerColors', function () {
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
    })
    .factory('itemTypes', function () {
        return {
            'card': 'Card',
            'vote': 'Vote',
            'rating': 'Rating',
            'result': 'Result'
        }
    })
    .factory('Home', function (Socket, $location) {
        var homeFactory = {};
        homeFactory.displayData = {};
        homeFactory.type = "card";
        homeFactory.labels = [];
        homeFactory.options = null;
        homeFactory.voteId = -1;

        Socket.on('display', function (event) {
            var data = JSON.parse(event.data).data;
            console.log("new display: " + data.type);
            homeFactory.type = "card";
            homeFactory.labels = [];
            homeFactory.options = null;
            if (data) {
                if (!!data.text) homeFactory.text = data.text.split("::");
                homeFactory.displayData = data;
                if (data.type) {
                    switch (data.type) {
                        case "vote":
                            homeFactory.type = "vote";
                            homeFactory.options = data.voteOptions;
                            homeFactory.limit = data.voteMulti;
                            homeFactory.checked = 0;
                            homeFactory.votelast = "vote";
                            homeFactory.voteId = data.voteId;
                            break;
                        case "result":
                            homeFactory.type = "result";
                            //homeFactory.text = "";
                            homeFactory.labels = data.labels;
                            homeFactory.data = data.data;
                            homeFactory.votelast = "result";
                            break;
                        case "card":
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
            if (data.otherPlayers) statusFactory.otherPlayers = data.otherPlayers;
            if (data.maxPlayers) statusFactory.maxPlayers = data.maxPlayers;
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

        Socket.on('status', function(event) {
            var data = JSON.parse(event.data).data;
            for (var i = 0; i < data.playerRatings.length; i++) {
                ratingFactory.myRatings[i] = data.playerRatings[i];
            }
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
            Socket.emit({type: "chat", data:{sender: Status.player.playerId, recepient: pid, message: msg}});
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
;