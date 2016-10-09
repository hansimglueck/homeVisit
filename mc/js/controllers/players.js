(function () {
    'use strict';

    angular.module('homeVisitMCApp')
        .controller("PlayerDetailsCtrl", function ($scope, Socket, playerColors) {

            $scope.socket = Socket;
            $scope.playerColors = playerColors;

            $scope.score = function (id, val) {
                console.log("score " + val);
                //Socket.emit("setPlayerStatus", {cmd: "score", id: id, value: val});
                Socket.emit("score", {playerId: id, score: val, reason: 'mc'});
            };

            $scope.throwOut = function (playerId) {
                if (!confirm("really throw out of the game?")) return;
                Socket.emit("setPlayerStatus", {cmd: "throwOut", id: playerId});
            }
        })
})();
