'use strict';

angular.module('homeVisitMCApp')
    .controller('MatchingCtrl', function ($scope, Polls, Matches, PlayerNames, Teams, gettextCatalog) {
        $scope.gettextCatalog = gettextCatalog;
        $scope.polls = Polls;
        $scope.matches = Matches;
        $scope.playerNames = PlayerNames.getNames;
        $scope.customPlayerNames = PlayerNames.customPlayerNames;
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
        
        // noone of the 15 players is assigned to any team at first
        // to assign them: add team number into the player number's line field
        $scope.playerInTeam = [
            [],[],[],[],[],[],[],[],[],[],[],[],[],[],[]
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
        
        //$scope.getMatrix();
        
        
        
        // Am Anfang sind alle Spieler im "Pool" --- wird grad nicht wirklich benutzt
        $scope.playerPool = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14];
        
        $scope.calcTeam = function(cat_index) {
            var potPlayers = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
            var potPlayersLength = 0;
            if ($scope.playerPool.length > 0) {
                // Erstes Kriterium
                for (var potPlayer = 0; potPlayer < $scope.playerPool.length; potPlayer++) {
                    var answer = Polls.polls[$scope.teamCategories[cat_index].questionNr[0]].answers[potPlayer];
                    var type = Polls.polls[$scope.teamCategories[cat_index].questionNr[0]].type;
                    var weight = $scope.teamCategories[cat_index].weight[0];    // +1 = positive criterium: high votings count, -1 = negative criterium: low votings count
                    if (answer != -1) {
                        if (weight == 1) {
                            if (type == 'binary' && answer == 1) {
                                potPlayers[potPlayer] = {id:potPlayer,name: $scope.playerNames[potPlayer]};
                                potPlayersLength++;
                            } else if (type == 'fingers' && answer >= 3) {
                                potPlayers[potPlayer] = {id:potPlayer,name: $scope.playerNames[potPlayer]};
                                potPlayersLength++;
                            }
                        } else {
                            if (type == 'binary' && answer != 1) {
                                potPlayers[potPlayer] = {id:potPlayer,name: $scope.playerNames[potPlayer]};
                                potPlayersLength++;
                            } else if (type == 'fingers' && answer <= 2) {
                                potPlayers[potPlayer] = {id:potPlayer,name: $scope.playerNames[potPlayer]};
                                potPlayersLength++;
                            }
                        }
                    }
                }
                // Ausschlusskriterien
                for (var question = 1; question < $scope.teamCategories[cat_index].questionNr.length; question++) {
                    // Only check the Ausschlusskriterien, if there are still more than 2 players in one category
                    if (potPlayersLength > 2) {
                        var throwOut = [];
                        for (var player = 0; player < potPlayers.length; player++) {
                            if (potPlayers[player] != null) {
                                console.log("Checke player: " + player);
                                var answer = Polls.polls[$scope.teamCategories[cat_index].questionNr[question]].answers[player];
                                var type = Polls.polls[$scope.teamCategories[cat_index].questionNr[question]].type;
                                var weight = $scope.teamCategories[cat_index].weight[question];
                                if (answer != -1) {
                                    if (weight == 1) {
                                        if (type == 'binary' && answer != 1) {
                                            console.log("Fliegt raus: " + player);
                                            throwOut.push(player);
                                        } else if (type == 'fingers' && answer <= 1) {
                                            console.log("Fliegt raus: " + player);
                                            throwOut.push(player);
                                        }
                                    } else {
                                        if (type == 'binary' && answer == 1) {
                                            console.log("Fliegt raus: " + player);
                                            throwOut.push(player);
                                        } else if (type == 'fingers' && answer >=4) {
                                            console.log("Fliegt raus: " + player);
                                            throwOut.push(player);
                                        }
                                    }
                                }
                            }
                        }
                        //console.log("Potentielle: " + potPlayersLength);
                        //console.log("Rausflieger: " + throwOut.length);
                        //console.log(potPlayers);
                        for (var thrownPlayer = 0; thrownPlayer < throwOut.length; thrownPlayer++) {
                            // Only keep throwing out, if there will be 2 players stay in
                            if (throwOut.length <= potPlayersLength - 2) {
                                // and only if the player has been assigned to several teams ---- seems to be too strict
                                //if ($scope.playerInTeam[throwOut[thrownPlayer]].length > 1) {
                                    //console.log(throwOut[thrownPlayer]);
                                    potPlayers[throwOut[thrownPlayer]] = null;
                                    potPlayersLength--;
                                    //console.log("raus: " + throwOut[thrownPlayer]);
                                //}
                            }
                        }
                        //console.log(potPlayers);
                    }
                }
            }
            
            for (var playerIndex = 0; playerIndex < potPlayers.length; playerIndex++) {
                if (potPlayers[playerIndex] != null && $scope.playerInTeam[potPlayers[playerIndex].id].indexOf(cat_index) === -1) {
                    $scope.playerInTeam[potPlayers[playerIndex].id].push(cat_index);
                    Teams.categories[cat_index].players.push(potPlayers[playerIndex]);
                    //console.log("Player id: " + potPlayers[playerIndex].id);
                    //console.log("Category: " + cat_index);
                }
            }
            return potPlayers; 
        }
        
        // Calculate potential team members
        for (var teamCats = 0; teamCats < Teams.categories.length; teamCats++) {
            $scope.calcTeam(teamCats);   
        }
        
        // Nochmal aussieben
        for (var playerIndex = 0; playerIndex < $scope.playerInTeam.length; playerIndex++) {
            var teamArray = $scope.playerInTeam[playerIndex];
            //console.log("Teamarray: " + teamArray);
            // check if the player has been assigned to several teams
            if (teamArray.length > 1) {
                // find team with the least members, delete association to all other teams
                var littlestTeam = teamArray[0];
                for (var index = 0; index < teamArray.length; index++) {
                    if (Teams.categories[teamArray[index]].players.length < Teams.categories[littlestTeam].players.length) {
                        littlestTeam = teamArray[index];
                    }
                }
                //console.log("littlest team: " + littlestTeam);
                //console.log("Index: " + teamArray.indexOf(littlestTeam));
                
                $scope.playerInTeam[playerIndex] = [];
                $scope.playerInTeam[playerIndex].push(littlestTeam);
            }  
        }
        
        $scope.playerIsInTeam = function (playerField, teamId) {
            return $.inArray(teamId, playerField) != -1;
        }
        
        $scope.playerPerfectAssigned = function (playerId) {
            // player has been assigned to one team only
            return $scope.playerInTeam[playerId].length === 1;
        }
        
        $scope.playerDoesntMatch = function (playerField) {
            // player has not been assigned to any team
            return playerField.length === 0;
        }
        
        $scope.playerFulfills = function (playerId) {
            var infoArray = [];
            var cat_index = $scope.playerInTeam[playerId][0];
            for (var quest_index = 0; quest_index < Teams.categories[cat_index].questionNr.length; quest_index++) {
                var questId = Teams.categories[cat_index].questionNr[quest_index];
                var questType = Polls.polls[questId].type;
                if (questType === 'binary') {
                    if (Polls.polls[questId].answers[playerId] === 1) {
                        infoArray.push(Polls.polls[questId].note + ": +");
                    } else if (Polls.polls[questId].answers[playerId] === 0) {
                        infoArray.push(Polls.polls[questId].note + ": -");
                    }
                } else if (questType === 'fingers') {
                    if (Polls.polls[questId].answers[playerId] !== -1) {
                        infoArray.push(Polls.polls[questId].note + ": " + Polls.polls[questId].answers[playerId]);
                    }
                }
            }
            return infoArray;
        }
        
        $scope.playerAnswered = function (playerId) {
            var infoArray = [];
            for (var quest_index = 0; quest_index < Polls.polls.length; quest_index++) {
                var questType = Polls.polls[quest_index].type;
                if (questType === 'binary') {
                    if (Polls.polls[quest_index].answers[playerId] === 1) {
                        infoArray.push(Polls.polls[quest_index].note + ": +");
                    } else if (Polls.polls[quest_index].answers[playerId] === 0) {
                        infoArray.push(Polls.polls[quest_index].note + ": -");
                    }
                } else if (questType === 'fingers') {
                    if (Polls.polls[quest_index].answers[playerId] !== -1) {
                        infoArray.push(Polls.polls[quest_index].note + ": " + Polls.polls[quest_index].answers[playerId]);
                    }
                }
            }
            return infoArray;
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
