'use strict';

/**
 * @ngdoc function
 * @name homeVisitMCApp.controller:PlayersCtrl
 * @description
 * # PlayersCtrl
 * Controller of the homeVisitMCApp
 */
angular.module('homeVisitMCApp')
    .controller('PlayersCtrl', function ($scope, Status, Socket, playerColors, $routeParams) {
        $scope.tableDisplayType = "playerDetails";
        $scope.playerId = $routeParams.playerId;
        if (typeof $scope.playerId === "undefined") $scope.tableDisplayType = "playback";

        $scope.socket = Socket;
        $scope.status = Status;
        $scope.playerColors = playerColors;
        $scope.tableDisplay = {
            type: 'playback'
        };
        $scope.playerPos = [
            {top: 10, left: 15},
            {top: 10, left: 330},
            {top: 10, left: 645},
            {top: 10, left: 960},
            {top: 490, left: 960},
            {top: 490, left: 645},
            {top: 490, left: 330},
            {top: 490, left: 15}
        ];
    })
    .controller("PlayerDetailsCtrl", function ($scope) {
        $scope.score = function (playerId, score) {
            console.log("score " + score);
            score = parseInt(score);
            Socket.emit("score", {playerId: playerId, score: score});
            $scope.tableDisplay.type = "playback";
        };
    });
