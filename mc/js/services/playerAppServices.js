angular.module('playerAppServices', [])
    .factory('colors', function () {
        return {
            rot: {'background-color': '#9e0000', 'color': '#BBBBBB'},
            hellblau: {'background-color': '#2883c3', 'color': '#555555'},
            dunkelblau: {'background-color': '#0c3669', 'color': '#BBBBBB'},
            orange: {'background-color': '#f78500', 'color': '#555555'},
            gelb: {'background-color': '#ffd800', 'color': '#555555'},
            gruen: {'background-color': '#c4df0d', 'color': '#555555'},
            lila: {'background-color': '#b27de4', 'color': '#555555'},
            weiss: {'background-color': '#9f9f9f', 'color': '#555555'}
        }

    })
    .factory('borderColors', function () {
        var width = "5px";
        return {
            rot: {'border': width + ' solid #9e0000'},
            hellblau: {'border': width + ' solid #2883c3'},
            dunkelblau: {'border': width + ' solid #0c3669'},
            orange: {'border': width + ' solid #f78500'},
            gelb: {'border': width + ' solid #ffd800'},
            gruen: {'border': width + ' solid #c4df0d'},
            lila: {'border': width + ' solid #b27de4'},
            weiss: {'border': width + ' solid #9f9f9f'}
        }
    })
    .factory('playerColors', function () {
        return [
            ["rot", "rot"],
            ["hellblau", "hellblau"],
            ["dunkelblau", "dunkelblau"],
            ["orange", "orange"],
            ["gelb", "gelb"],
            ["gruen", "gruen"],
            ["lila", "lila"],
            ["weiss", "weiss"],
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
        });

        Socket.on('status', function (event) {
            var data = JSON.parse(event.data).data;
            console.log(data);
            if (data.otherPlayers) {
                statusFactory.otherPlayers = data.otherPlayers;
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

;
