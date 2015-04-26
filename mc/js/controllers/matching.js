'use strict';

angular.module('homeVisitMCApp')
    .controller('MatchingCtrl', function ($scope, Polls, Matches, PlayerNames, Teams) {
        $scope.polls = Polls;
        $scope.matches = Matches;
        $scope.playerNames = PlayerNames.names;
        $scope.playerLine = 0;
        $scope.teamCategories = Teams.categories;
        
        $scope.matchMatrix = [
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
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
        
        
        
        // Am Anfang sind alle Spieler im "Pool"
        $scope.playerPool = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14];
        
        $scope.calcTeam = function(cat_index) {
            var potPlayers = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
            var potPlayersLength = 0;
            if ($scope.playerPool.length > 0) {
                // Erstes Kriterium
                for (var potPlayer = 0; potPlayer < $scope.playerPool.length; potPlayer++) {
                    var answer = Polls.polls[$scope.teamCategories[cat_index].questionNr[0]].answers[potPlayer];
                    var type = Polls.polls[$scope.teamCategories[cat_index].questionNr[0]].type;
                    var note = Polls.polls[$scope.teamCategories[cat_index].questionNr[0]].note;
                    var weight = $scope.teamCategories[cat_index].weight[0];
                    //if (answer != -1) {
                        if (weight == 1) {
                            if (type == 'binary' && answer == 1) {
                                //if ($scope.playerPool.indexOf(potPlayer) != -1) {
                                    potPlayers[potPlayer] = {id:potPlayer,name: $scope.playerNames[potPlayer],cat:note};
                                    potPlayersLength++;
                                    //potPlayers.push({id:potPlayer,name: $scope.playerNames[potPlayer],cat:note});
                                    //potPlayers.push({id:potPlayer});
                                //}
                            } else if (type == 'fingers' && answer === 5) {
                                //if ($scope.playerPool.indexOf(potPlayer) != -1) {
                                    potPlayers[potPlayer] = {id:potPlayer,name: $scope.playerNames[potPlayer],cat:note};
                                    potPlayersLength++;
                                    //potPlayers.push({id:potPlayer,name: $scope.playerNames[potPlayer],cat:note});
                                    //potPlayers.push({id:potPlayer});
                                //}
                            }
                        } else {
                            if (type == 'binary' && answer != 1) {
                                //if ($scope.playerPool.indexOf(potPlayer) != -1) {
                                    potPlayers[potPlayer] = {id:potPlayer,name: $scope.playerNames[potPlayer],cat:note};
                                    potPlayersLength++;
                                    //potPlayers.push({id:potPlayer,name: $scope.playerNames[potPlayer],cat:note});
                                    //potPlayers.push({id:potPlayer});
                                //}
                            } else if (type == 'fingers' && answer <= 1) {
                                //if ($scope.playerPool.indexOf(potPlayer) != -1) {
                                    potPlayers[potPlayer] = {id:potPlayer,name: $scope.playerNames[potPlayer],cat:note};
                                    potPlayersLength++;
                                    //potPlayers.push({id:potPlayer,name: $scope.playerNames[potPlayer],cat:note});
                                    //potPlayers.push({id:potPlayer});
                                //}
                            }
                        }
                    //}
                }
                // Ausschlusskriterien
                for (var question = 1; question < $scope.teamCategories[cat_index].questionNr.length; question++) {
                    if (potPlayersLength > 2) {
                        var throwOut = [];
                        for (var player = 0; player < potPlayers.length; player++) {
                            if (potPlayers[player] != null) {
                                console.log("Checke player: " + player);
                                var answer = Polls.polls[$scope.teamCategories[cat_index].questionNr[question]].answers[player];
                                var type = Polls.polls[$scope.teamCategories[cat_index].questionNr[question]].type;
                                var weight = $scope.teamCategories[cat_index].weight[question];
                                //if (answer != -1) {
                                    if (weight == 1) {
                                        if (type == 'binary' && answer != 1) {
                                            console.log("Fliegt raus: " + player);
                                            throwOut.push(player);
                                        } else if (type == 'fingers' && answer < 4 && answer != -1) {
                                            console.log("Fliegt raus: " + player);
                                            throwOut.push(player);
                                        }
                                    } else {
                                        if (type == 'binary' && answer == 1) {
                                            console.log("Fliegt raus: " + player);
                                            throwOut.push(player);
                                        } else if (type == 'fingers' && (answer != 0 || answer != 1 || answer != 2)) {
                                            console.log("Fliegt raus: " + player);
                                            throwOut.push(player);
                                        }
                                    }
                                //}
                            }
                        }
                        console.log("Potentielle: " + potPlayersLength);
                        console.log("Rausflieger: " + throwOut.length);
                        if (throwOut.length <= potPlayersLength - 2) { // Nur rauswerfen, wenn mind. 2 Ÿbrig bleiben
                            console.log(potPlayers);
                            for (var thrownPlayer = 0; thrownPlayer < throwOut.length; thrownPlayer++) {
                                console.log(throwOut[thrownPlayer]);
                                potPlayers[throwOut[thrownPlayer]] = null;
                                potPlayersLength--;
                                //console.log(potPlayers.splice($.inArray(throwOut[thrownPlayer],potPlayers) ,1 ));
                                //potPlayers.splice($.inArray(throwOut[thrownPlayer].id,potPlayers) ,1 );
                                console.log("raus: " + throwOut[thrownPlayer]);
                            }
                            console.log(potPlayers);
                        }
                    } else {
                        if (potPlayersLength === 2) {
                            //for (var removeFromPool = 0; removeFromPool < potPlayers.length; removeFromPool++) {
                            //    if (potPlayers[removeFromPool] != null) {
                            //        $scope.playerPool.splice($inArray(removeFromPool),1);
                            //    }
                            //}
                            return potPlayers;
                        }
                    }
                }
            }
            return potPlayers;

            
        }
        
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
