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
        
        $scope.toggleSelected = function (id) {
            console.log("select player " + id);
            Socket.emit("setPlayerStatus", {cmd: "toggleSelected", id: id});
        }
        
        $scope.playerSelected = function (id) {
            if (Status.otherPlayers[id].selected) {
                return 'Deselect';
            } else {
                return 'Select';
            }
        }
        
        $scope.toggleAway = function (id) {
            console.log("select player " + id);
            Socket.emit("setPlayerStatus", {cmd: "toggleAway", id: id});
        }
        
        $scope.playerAway = function (id) {
            if (Status.otherPlayers[id].away) {
                return 'Come Back!';
            } else {
                return 'Leave Table!';
            }
        }
        
        $scope.myTurn = function (id) {
            if (Status.otherPlayers[id].onTurn) {
                return 'My Turn!';
            } else if (Status.otherPlayers[id].away) {
                return 'Away';
            } else {
                return '---';
            }
        }
        
        $scope.awayColor = function (id) {
            if (Status.otherPlayers[id].away) {
                return '#aaa'
            } else {
                return ''
            }
        }
    })
    .controller("PlayerDetailsCtrl", function ($scope, Socket, playerColors) {
        
        $scope.socket = Socket;
        $scope.playerColors = playerColors;
        
        $scope.score = function (id, val) {
            console.log("score " + val);
            //Socket.emit("setPlayerStatus", {cmd: "score", id: id, value: val});
            Socket.emit("score", {playerId: id, score: val, reason: 'mc'});
        };
    });
