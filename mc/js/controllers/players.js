(function() {
    'use strict';

    angular.module('homeVisitMCApp')
        .controller('PlayersCtrl', function ($scope, Status, Socket, playerColors, $routeParams, gettextCatalog, TeamActionInfo) {
            $scope.tableDisplayType = "playerDetails";
            $scope.playerId = $routeParams.playerId;
            if (typeof $scope.playerId === "undefined") {
                $scope.tableDisplayType = "playback";
            }
            $scope.socket = Socket;
            $scope.status = Status;
            $scope.playerColors = playerColors;
            $scope.tableDisplay = {
                type: 'playback'
            };
            $scope.playerPos = [
                {top: 8, left: 15},
                {top: 8, left: 330},
                {top: 8, left: 645},
                {top: 8, left: 960},
                {top: 560, left: 960},
                {top: 560, left: 645},
                {top: 560, left: 330},
                {top: 560, left: 15}
            ];

            $scope.toggleSelected = function (id) {
                console.log("select player " + id);
                Socket.emit("setPlayerStatus", {cmd: "toggleSelected", id: id});
            };

            $scope.playerSelected = function (id) {
                if (Status.otherPlayers[id].selected) {
                    return gettextCatalog.getString('Deselect');
                } else {
                    return gettextCatalog.getString('Select');
                }
            };

            $scope.toggleAway = function (id) {
                console.log("select player " + id);
                Socket.emit("setPlayerStatus", {cmd: "toggleAway", id: id});
            };

            $scope.playerAway = function (id) {
                if (Status.otherPlayers[id].away) {
                    return gettextCatalog.getString('Come Back!');
                } else {
                    return gettextCatalog.getString('Leave Table!');
                }
            };

            $scope.myTurn = function (id) {
                if (Status.otherPlayers[id].onTurn) {
                    return gettextCatalog.getString('My Turn!');
                } else if (Status.otherPlayers[id].away) {
                    return gettextCatalog.getString('Away');
                } else {
                    return '';
                }
            };

            $scope.awayColor = function (id) {
                if (Status.otherPlayers[id].away) {
                    return '#aaa';
                } else {
                    return '';
                }
            };

            $scope.isOnTurn = function(id) {
                return Status.otherPlayers[id].onTurn;
            };

            $scope.isUpcoming = function(id) {
                return Status.otherPlayers[id].upcoming;
            };

            $scope.wantsToBeNext = function(id) {
                if (!Status.otherPlayers[id].onTurn && !Status.otherPlayers[id].away && Status.otherPlayers[id].joined) {
                    return true;
                }
                return false;
            };

            $scope.upcomingPlayer = function(id) {
                Socket.emit("setPlayerStatus", {cmd: "setUpcoming", id: id});
                console.log("Ich bin als naechstes dran: Player " + id);
            };

            $scope.showInfoOfTeam = function(playerId) {
                return TeamActionInfo.actionInfo[playerId];
            };
        })
        .controller("PlayerDetailsCtrl", function ($scope, Socket, playerColors) {

            $scope.socket = Socket;
            $scope.playerColors = playerColors;

            $scope.score = function (id, val) {
                console.log("score " + val);
                //Socket.emit("setPlayerStatus", {cmd: "score", id: id, value: val});
                Socket.emit("score", {playerId: id, score: val, reason: 'mc'});
            };

            $scope.throwOut = function(playerId) {
                if (!confirm("really throw out of the game?")) return;
                Socket.emit("setPlayerStatus", {cmd: "throwOut", id: playerId});
            }
        })

    .controller("ResultsController", function ($scope, Socket, TeamActionInfo) {

        $scope.socket = Socket;
        $scope.teamActionInfo = TeamActionInfo;
    });

})();
