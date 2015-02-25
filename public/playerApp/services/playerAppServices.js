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
    .factory('Status', function (Socket) {

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

        statusFactory.connected = function () {
            return Socket.connected();
        };
        statusFactory.joinGame = function () {
            Socket.emit({type: "joinGame", data: {}});
        };
        statusFactory.leaveGame = function () {
            Socket.emit({type: "leaveGame", data: {}});
        };
        statusFactory.resetPlayer = function() {
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

        ratingFactory.fillMyRatings = function() {
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
;