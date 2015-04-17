'use strict';

/**
 * @ngdoc function
 * @name homeVisitMCApp.controller:PlayersCtrl
 * @description
 * # PlayersCtrl
 * Controller of the homeVisitMCApp
 */
angular.module('homeVisitMCApp')
    .controller('PlayersCtrl', function ($scope, Status, Socket, playerColors) {
        $scope.socket = Socket;
        $scope.status = Status;
        $scope.playerColors = playerColors;
        $scope.tableDisplay = {
            type: 'playback'
        };
        $scope.players = [
            {playerId: 0, name: 'player1', top: 10, left: 189, color: '#000000'},
            {playerId: 1, name: 'player2', top: 10, left: 377, color: '#000000'},
            {playerId: 2, name: 'player3', top: 10, left: 565, color: '#000000'},
            {playerId: 3, name: 'player4', top: 10, left: 753, color: '#000000'},
            {playerId: 4, name: 'player5', top: 10, left: 941, color: '#000000'},
            {playerId: 5, name: 'player6', top: 150, left: 1110, color: '#000000'},
            {playerId: 6, name: 'player7', top: 340, left: 1110, color: '#000000'},
            {playerId: 7, name: 'player8', top: 490, left: 941, color: '#000000'}
        ];

        //
        //$scope.getPlayers = function() {
        //    if (Status.otherPlayers.length == 0) return;
        //    var players = $scope.status.otherPlayers.filter(function(p){return p.joined;});
        //    return players;
        //};

        $scope.showScore = function(player) {
            $scope.tableDisplay.type = "score";
            $scope.tableDisplay.player = player;
        };
        $scope.showPlayback = function(player) {
            $scope.tableDisplay.type = "playback";
        };
        $scope.score = function(playerId, score) {
            console.log("score "+score);
            score = parseInt(score);
            Socket.emit("score", {playerId:playerId, score:score});
            $scope.tableDisplay.type = "playback";
        };
        $scope.playback = function(cmd, param) {
            console.log("play clicked");
            Socket.emit("playbackAction", {data:cmd, param:param});
        };
        $scope.alert = function() {
            console.log("Alarm clicked");
            Socket.emit("alert");
        }

   });
