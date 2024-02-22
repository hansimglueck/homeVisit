(function() {
    'use strict';

    angular.module('homeVisitMCApp')
        .controller('MatchingCtrl', function ($scope, Polls, Matches, PlayerNames, Teams, TeamCriteria, gettextCatalog) {
            $scope.gettextCatalog = gettextCatalog;
            $scope.polls = Polls;
            $scope.matches = Matches;
            $scope.playerNames = PlayerNames.getNames;
            $scope.customPlayerNames = PlayerNames.customPlayerNames;
            $scope.playerLine = 0;
            $scope.teamCategories = Teams.categories;
            $scope.maxMatchNumber = 0;
            // number of settled teams
            $scope.teamsSet = 0;
            
            // index == question_index, content == team nr
            $scope.teamCriteria = TeamCriteria.criteria;
            
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
            
            // noone of the 15 players is assigned to any team at first
            // to assign them: put player number of the partner into player number's line field
            $scope.playerInTeam = [
                [],[],[],[],[],[],[],[],[],[],[],[],[],[],[]
            ];
            
            $scope.resultTeams = [
                [],[],[],[],[],[],[],[],[],[],[],[],[],[],[]
            ];
            
            $scope.getResultTeams = function() {
                var resultTeamsInGame = [];
                for (var i = 0; i < $scope.resultTeams.length; i++) {
                    if (PlayerNames.inGame[$scope.resultTeams[i][0]] == 1) {
                        resultTeamsInGame.push($scope.resultTeams[i]);
                    }
                }
                return resultTeamsInGame;
            
            }
            
            $scope.getMatrix = function(){
                //console.log(Polls.polls.length);
                
                for (var playerX = 0; playerX < $scope.matchMatrix.length; playerX++) {
                    //console.log(playerX);
                    for (var playerY = 0; playerY < $scope.matchMatrix[playerX].length; playerY++) {
                        //console.log(playerY);
                        for (var answer_index = 0; answer_index < Polls.polls.length; answer_index++) {
                            //console.log(answer_index);
                            var diff = 0;
                            if (Polls.polls[answer_index].answers[playerX] === -1 ||
                                Polls.polls[answer_index].answers[playerY] === -1) {
                                diff = 5;
                            } else {
                                diff = Math.abs(Polls.polls[answer_index].answers[playerX] - Polls.polls[answer_index].answers[playerY]);
                            }
                            //console.log(diff);
                            //console.log(Polls.polls[answer_index].type);
                            if (Polls.polls[answer_index].type === 'binary') {
                                //console.log("BINARY");
                                //if (diff == 0) {$scope.matchMatrix[playerX][playerY] += 3;}
                                if (diff === 0) {
                                    $scope.matchMatrix[playerX][playerY] += 1;
                                }
                            } else if (Polls.polls[answer_index].type === 'fingers') {
                                //console.log("FINGERS");
                                //if (diff == 0) {$scope.matchMatrix[playerX][playerY] += 3;}
                                //if (diff == 1) {$scope.matchMatrix[playerX][playerY] += 2;}
                                //if (diff == 2) {$scope.matchMatrix[playerX][playerY] += 1;}
                                if (diff <= 1) {
                                    $scope.matchMatrix[playerX][playerY] += 1;
                                }
                            }
                            if (PlayerNames.inGame[playerX] === 0) {
                                $scope.matchMatrix[playerX][playerY] = -1;
                                $scope.matchMatrix[playerY][playerX] = -1;
                                $scope.matchMatrix[playerX][playerX] = -1;
                            }
                            if (PlayerNames.inGame[playerY] === 0) {
                                $scope.matchMatrix[playerX][playerY] = -1;
                                $scope.matchMatrix[playerY][playerX] = -1;
                                $scope.matchMatrix[playerY][playerY] = -1;
                            }
                        }
                    }
                }
                console.log($scope.matchMatrix);
                return $scope.matchMatrix;
            };
            
            $scope.getMatrix();
            
            $scope.getMaxMatchNumber = function() {
                for (var playerX = 0; playerX < $scope.matchMatrix.length; playerX++) {
                    for (var playerY = 0; playerY < $scope.matchMatrix[playerX].length; playerY++) {
                        if ($scope.matchMatrix[playerX][playerY] > $scope.maxMatchNumber) {
                            $scope.maxMatchNumber = $scope.matchMatrix[playerX][playerY];
                        }
                    }
                }
                //return maxMatchNumber;
            };
            
            $scope.getMaxMatchNumber();
            
            $scope.storeMatchingValues = function(team_index) {
                var playerX = $scope.resultTeams[team_index][0];
                var playerY = $scope.resultTeams[team_index + 1][0];
                console.log("Match " + playerX + " mit " + playerY);
                for (var quest_index = 0; quest_index < Polls.polls.length; quest_index++) {
                    var questType = Polls.polls[quest_index].type;
                    if (questType === 'binary') {
                        if (Polls.polls[quest_index].answers[playerX] === Polls.polls[quest_index].answers[playerY] &&
                            Polls.polls[quest_index].answers[playerX] !== -1 &&
                            Polls.polls[quest_index].answers[playerY] !== -1) {
                            $scope.resultTeams[team_index].push(quest_index);
                            $scope.resultTeams[team_index + 1].push(quest_index);
                            //if (Polls.polls[quest_index].answers[playerX] == 1) {
                            //    $scope.resultTeams[team_index].push(Polls.polls[quest_index].note + ": +");
                            //    $scope.resultTeams[team_index + 1].push(Polls.polls[quest_index].note + ": +");
                            //} else if (Polls.polls[quest_index].answers[playerX] == 0) {
                            //    $scope.resultTeams[team_index].push(Polls.polls[quest_index].note + ": -");
                            //    $scope.resultTeams[team_index + 1].push(Polls.polls[quest_index].note + ": -");
                            //}
                        }
                    } else if (questType === 'fingers') {
                        if (Polls.polls[quest_index].answers[playerX] !== -1 &&
                            Polls.polls[quest_index].answers[playerY] !== -1) {
                            if (Math.abs(Polls.polls[quest_index].answers[playerX] - Polls.polls[quest_index].answers[playerY]) <= 1) {
                                $scope.resultTeams[team_index].push(quest_index);
                                $scope.resultTeams[team_index + 1].push(quest_index);
                                //$scope.resultTeams[team_index].push(Polls.polls[quest_index].note + ": " + Polls.polls[quest_index].answers[playerX]);
                                //$scope.resultTeams[team_index + 1].push(Polls.polls[quest_index].note + ": " + Polls.polls[quest_index].answers[playerY]);
                            }
                        }
                    }
                }
            };
            
            $scope.assignTeams = function() {
                if ($scope.teamsSet < 7) {
                    var foundMaxMatch = false;
                    for (var playerX = 0; playerX < $scope.matchMatrix.length; playerX++) {
                        for (var playerY = 0; playerY < $scope.matchMatrix[playerX].length; playerY++) {
                            if (playerX !== playerY &&
                                $scope.playerInTeam[playerX].length === 0 &&
                                $scope.playerInTeam[playerY].length === 0) {
                                if ($scope.matchMatrix[playerX][playerY] >= $scope.maxMatchNumber) {
                                    // hohes Matching gefunden ---> Team festlegen!
                                    $scope.playerInTeam[playerX].push(playerY);
                                    $scope.playerInTeam[playerY].push(playerX);
                                    $scope.matchMatrix[playerX][playerY] = -1;
                                    $scope.matchMatrix[playerY][playerX] = -1;
                                    console.log("Matched: " + playerX + playerY);
                                    $scope.resultTeams[$scope.teamsSet * 2].push(playerX);
                                    $scope.resultTeams[$scope.teamsSet * 2 + 1].push(playerY);
                                    $scope.storeMatchingValues($scope.teamsSet * 2);
                                    foundMaxMatch = true;
                                    $scope.teamsSet++;
                                }
                            }
                        }
                    }
                    if (!foundMaxMatch) {
                        $scope.maxMatchNumber--;
                        console.log("MaxMatchnumber: " + $scope.maxMatchNumber);
                    }
                    $scope.assignTeams();
                } else {
                    // assign the last one
                    for (var index = 0; index < $scope.playerInTeam.length; index++) {
                        if ($scope.playerInTeam[index].length === 0) {
                            $scope.resultTeams[$scope.resultTeams.length - 1].push(index);
                            return;
                        }
                    }
                }
            };
            
            $scope.getPlayerCount = function() {
                return PlayerNames.getPlayerCount();
            }
            
            $scope.matchLastPlayer = function(index) {
                var playerIndex = index;
                var bestMatch = 0;
                var bestPartnerIndex = -1;
                // console.log("Matchmatrix: " + $scope.matchMatrix);
                // console.log("playerindex: " + playerIndex);
                for (var playerY = 0; playerY < $scope.matchMatrix[playerIndex].length; playerY++) {
                    console.log("matchlast i: " + playerIndex);
                    if (playerY !== playerIndex && $scope.matchMatrix[playerIndex][playerY] > bestMatch) {
                        bestMatch = $scope.matchMatrix[playerIndex][playerY];
                        bestPartnerIndex = playerY;
                    }
                }
                if (bestMatch <= 0) {
                    return gettextCatalog.getString("Doesn't match well. Should play alone.");
                } else {
                    return gettextCatalog.getString('Matches best with the team of {{name1}} and {{name2}}.', {
                        name1 : $scope.customPlayerNames[bestPartnerIndex] || $scope.playerNames()[bestPartnerIndex],
                        name2 : $scope.customPlayerNames[$scope.playerInTeam[bestPartnerIndex]] || $scope.playerNames()[$scope.playerInTeam[bestPartnerIndex]]
                    });
                }
            };
            
            $scope.assignTeams();
            console.log($scope.playerInTeam);
            
            console.log("Result teams: ");
            console.log($scope.resultTeams);
            
            $scope.getCritNote = function(playerIndex, questIndex) {
                var player = playerIndex[0];
                
                var questType = Polls.polls[questIndex].type;
                if (questType === 'binary') {
                    if (Polls.polls[questIndex].answers[player] === 1) {
                        return gettextCatalog.getString(Polls.polls[questIndex].note) + ": +";
                    } else if (Polls.polls[questIndex].answers[player] === 0) {
                        return gettextCatalog.getString(Polls.polls[questIndex].note) + ": -";
                    }
                }
                else if (questType === 'fingers') {
                    if (Polls.polls[questIndex].answers[player] <= 2) {
                        return gettextCatalog.getString(Polls.polls[questIndex].note) + ": -";
                    } else {
                        return gettextCatalog.getString(Polls.polls[questIndex].note) + ": +";
                    }
                }
                return "";
            };
            
            $scope.mark = function(playerIndex, critIndex) {
                $scope.teamCriteria[critIndex] = Math.floor(playerIndex / 2);
            };
            
            $scope.unmark = function(playerIndex, critIndex) {
                $scope.teamCriteria[critIndex] = -1;
            };
            
            $scope.isMarked = function(playerIndex, critIndex) {
                if ($scope.teamCriteria[critIndex] === Math.floor(playerIndex / 2)) {
                    return true;
                } else {
                    return false;
                }
            };
            
            $scope.isUsed = function(playerIndex, critIndex) {
                var teamIndex = Math.floor(playerIndex / 2);
                if ($scope.teamCriteria[critIndex] !== teamIndex && $scope.teamCriteria[critIndex] !== -1) {
                    return true;
                }
                return false;
            };
            
            $scope.playerFulfills = function (playerId) {
                var infoArray = [];
                var cat_index = $scope.playerInTeam[playerId][0];
                for (var quest_index = 0; quest_index < Teams.categories[cat_index].questionNr.length; quest_index++) {
                    var questId = Teams.categories[cat_index].questionNr[quest_index];
                    var questType = Polls.polls[questId].type;
                    if (questType === 'binary') {
                        if (Polls.polls[questId].answers[playerId] === 1) {
                            infoArray.push(gettextCatalog.getString(Polls.polls[questId].note) + ": +");
                        } else if (Polls.polls[questId].answers[playerId] === 0) {
                            infoArray.push(gettextCatalog.getString(Polls.polls[questId].note) + ": -");
                        }
                    } else if (questType === 'fingers') {
                        if (Polls.polls[questId].answers[playerId] !== -1) {
                            infoArray.push(gettextCatalog.getString(Polls.polls[questId].note) + ": " + Polls.polls[questId].answers[playerId]);
                        }
                    }
                }
                return infoArray;
            };
            
            $scope.playerAnswered = function (playerId) {
                var infoArray = [];
                for (var quest_index = 0; quest_index < Polls.polls.length; quest_index++) {
                    var questType = Polls.polls[quest_index].type;
                    if (questType === 'binary') {
                        if (Polls.polls[quest_index].answers[playerId] === 1) {
                            infoArray.push(gettextCatalog.getString(Polls.polls[quest_index].note) + ": +");
                        } else if (Polls.polls[quest_index].answers[playerId] === 0) {
                            infoArray.push(gettextCatalog.getString(Polls.polls[quest_index].note) + ": -");
                        }
                    } else if (questType === 'fingers') {
                        if (Polls.polls[quest_index].answers[playerId] !== -1) {
                            infoArray.push(gettextCatalog.getString(Polls.polls[quest_index].note) + ": " + Polls.polls[quest_index].answers[playerId]);
                        }
                    }
                }
                return infoArray;
            };

            $scope.isMatched = function(playerX, playerY) {
                if (Matches.matches[playerX][1] === playerY) {
                    return true;
                } else {
                    return false;
                }
            };

            $scope.matchUp = function(playerX, playerY) {
                console.log("Match: " + playerX + " + " + playerY);
                if (Matches.matches[playerX][0] !== Matches.matches[playerX][1]) {
                    $scope.clearMatch(Matches.matches[playerX][0], Matches.matches[playerX][1]);
                }
                if (Matches.matches[playerY][0] !== Matches.matches[playerY][1]) {
                    $scope.clearMatch(Matches.matches[playerY][0], Matches.matches[playerY][1]);
                }
                Matches.matches[playerX][1] = playerY;
                Matches.matches[playerY][1] = playerX;
            };

            $scope.clearMatch = function(playerX, playerY) {
                console.log("Clear: " + playerX + " + " + playerY);
                Matches.matches[playerX][1] = playerX;
                Matches.matches[playerY][1] = playerY;
            };

            $scope.playerLineCount = function (val) {
                $scope.playerLine = val;
                return $scope.playerLine;
            };
        });

})();
