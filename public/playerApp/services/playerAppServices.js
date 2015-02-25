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
                //if (!!data.text) $scope.text = data.text.split("::");
                //$scope.type = "card";
                //$scope.labels = [];
                //$scope.data = [];
                //if (data.type == "vote") {
                //    $scope.type = "vote";
                //    $scope.options = data.voteOptions;
                //    $scope.limit = data.voteMulti;
                //    $scope.checked = 0;
                //    $scope.votelast = "vote";
                //
                //}
                //else $scope.options = null;
                //if (data.type == "result") {
                //    $scope.type = "result";
                //    $scope.text = "";
                //    $scope.labels = data.labels;
                //    $scope.data = data.data;
                //    $scope.votelast = "result";
                //}
                //if (data.type == "rating") {
                //    $scope.type = 'rating';
                //    if (data.text == "start") {
                //        $scope.ratingActive = true;
                //    }
                //    if (data.text == "stop") {
                //        $scope.ratingActive = false;
                //    }
                //}
                //
            }
        });
        return homeFactory;
    })
    .factory('Status', function (Socket, $location) {

        var emptyPlayer = {playerId: -1, colors: ["weiss", "weiss"]};
        var statusFactory = {};
        statusFactory.player = emptyPlayer;
        statusFactory.otherPlayers = [];
        statusFactory.maxPlayers = 0;
        statusFactory.ratingActive = true;
        statusFactory.joined = false;
        statusFactory.server = Socket.server;

        Socket.on('status', function (event) {
            var data = JSON.parse(event.data).data;
            if (data.player) {
                statusFactory.player = data.player;
                if (data.player.playerId == -1) {
                    statusFactory.player = emptyPlayer;
                    statusFactory.joined = false;
                } else statusFactory.joined = true;
            }
            if (data.otherPlayers) statusFactory.otherPlayers = data.otherPlayers;
            if (data.maxPlayers) statusFactory.maxPlayers = data.maxPlayers;
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
            ratingFactory.avgRatings = data.avgRating;
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

        ratingFactory.getMyRatings = function () {
            return ratingFactory.myRatings;
        };
        ratingFactory.getAvgRatings = function () {
            return ratingFactory.avgRatings;
        };

        return ratingFactory;
    })
    .factory('Chat', function (Socket, Status) {

        var chatFactory = {};
        chatFactory.messages = [[[0,"hallo"],[1,"wie gehts?"]],[[0,"hallo"],[1,"wie gehts?"]]];
        chatFactory.messages = [];

        Socket.on('chat', function (event) {
            var data = JSON.parse(event.data).data;
            var playerId = data.playerId;
            if (typeof chatFactory.messages[playerId] == "undefined") chatFactory.messages[playerId] = [];
            chatFactory.messages[playerId].push([1,data.message]);
        });

        chatFactory.chat = function(pid, msg) {
            Socket.emit({type: "chat", data:{sender: Status.player.playerId, recepient: pid, message: msg}});
            if (typeof chatFactory.messages[pid] == "undefined") chatFactory.messages[pid] = [];
            chatFactory.messages[pid].push([0,msg]);
        };

        return chatFactory;
    })
;