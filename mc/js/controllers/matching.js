'use strict';

angular.module('homeVisitMCApp')
    .controller('MatchingCtrl', function ($scope, Polls, Matches) {
        $scope.polls = Polls;
        $scope.matches = Matches;
        $scope.playerLine = 0;
        
        $scope.matchMatrix = [
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        ];
        
        $scope.getMatrix = function(){
            //console.log(Polls.polls.length);
            
            for (var playerX = 0; playerX < $scope.matchMatrix.length; playerX++) {
                //console.log(playerX);
                for (var playerY = 0; playerY < $scope.matchMatrix[playerX].length; playerY++) {
                    //console.log(playerY);
                    for (var answer_index = 0; answer_index < Polls.polls.length; answer_index++) {
                        //console.log(answer_index);
                        var diff = 0;
                        if (Polls.polls[answer_index].answers[playerX] == -1 || Polls.polls[answer_index].answers[playerY] == -1) {
                            diff = 5;
                        } else {
                            var diff = Math.abs(Polls.polls[answer_index].answers[playerX] - Polls.polls[answer_index].answers[playerY]);
                        }
                        //console.log(diff);
                        //console.log(Polls.polls[answer_index].type);
                        if (Polls.polls[answer_index].type == 'binary') {
                            //console.log("BINARY");
                            //if (diff == 0) {$scope.matchMatrix[playerX][playerY] += 3;}
                            if (diff == 0) {$scope.matchMatrix[playerX][playerY] += 1;}
                        }else if (Polls.polls[answer_index].type == 'fingers') {
                            //console.log("FINGERS");
                            //if (diff == 0) {$scope.matchMatrix[playerX][playerY] += 3;}
                            //if (diff == 1) {$scope.matchMatrix[playerX][playerY] += 2;}
                            //if (diff == 2) {$scope.matchMatrix[playerX][playerY] += 1;}
                            if (diff <= 1) {$scope.matchMatrix[playerX][playerY] += 1;}
                        }
                    }
                }
            }
            //console.log($scope.matchMatrix);
            return $scope.matchMatrix;
        };
        
        $scope.getMatrix();
        
        $scope.isMatched = function(playerX, playerY) {
            if (Matches.matches[playerX][1] == playerY) {
                return true;
            } else {
                return false;
            }
        }
        
        $scope.matchUp = function(playerX, playerY) {
            console.log("Match: " + playerX + " + " + playerY);
            if (Matches.matches[playerX][0] != Matches.matches[playerX][1]) {
                $scope.clearMatch(Matches.matches[playerX][0], Matches.matches[playerX][1]);
            }
            if (Matches.matches[playerY][0] != Matches.matches[playerY][1]) {
                $scope.clearMatch(Matches.matches[playerY][0], Matches.matches[playerY][1]);
            }
            Matches.matches[playerX][1] = playerY;
            Matches.matches[playerY][1] = playerX;
        }
        
        $scope.clearMatch = function(playerX, playerY) {
            console.log("Clear: " + playerX + " + " + playerY);
            Matches.matches[playerX][1] = playerX;
            Matches.matches[playerY][1] = playerY;
        }
        
        $scope.playerLineCount = function (val) {
            $scope.playerLine = val;
            return $scope.playerLine;
        }
        
    });
