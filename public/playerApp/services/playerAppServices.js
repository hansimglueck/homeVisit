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

        var emptyPlayer = {playerId: -1, colors:["weiss","weiss"]};
        var statusFactory = {};
        statusFactory.player = emptyPlayer;
        statusFactory.otherPlayers = [];
        statusFactory.maxPlayers = 0;
        statusFactory.server = Socket.server;

        Socket.on('status', function (event) {
            var data = JSON.parse(event.data).data;
            if (data.player) {
                statusFactory.player = data.player;
                if (data.player.playerId == -1) statusFactory.player = emptyPlayer;
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
        statusFactory.leaveGame = function() {
            Socket.emit({type: "leaveGame", data: {}});
        };
        return statusFactory;


    })

    .factory('Rating', function (Socket, Status) {
        var myRatings = [];
        var avgRatings = [];
        var maxRating = 8;

        Socket.on('rates', function (event) {
            var data = JSON.parse(event.data).data;
            avgRatings = data.avgRating;
            console.log(avgRatings);
        });

        return {

            rate: function (id, diff) {
                myRatings[id] += diff;
                Socket.emit({type: "rate", data: {rate: myRatings, playerId: Status.player.playerId}});
            },
            getMyRatings: function () {
                if (Status.getMaxPlayers() != myRatings.length) {
                    for (var i = 0; i < Status.getMaxPlayers(); i++) {
                        myRatings[i] = myRatings[i] ? myRatings[i] : maxRating / 2;
                    }
                }
                return myRatings;
            },
            getAvgRatings: function () {
                return avgRatings;
            }
        }
    })
;