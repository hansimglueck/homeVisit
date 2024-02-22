(function () {
  'use strict';

  angular.module('homeVisitMCApp').controller('MatchingNewCtrl', MatchingNewCtrl);

  MatchingNewCtrl.$inject = ['$scope', 'Polls', 'Matches', 'PlayerNames', 'Teams', 'TeamCriteria', 'gettextCatalog'];

  function MatchingNewCtrl($scope, Polls, Matches, PlayerNames, Teams, TeamCriteria, gettextCatalog) {
    $scope.gettextCatalog = gettextCatalog;
    $scope.polls = Polls;
    $scope.matches = Matches;
    $scope.playerNames = PlayerNames.getNames;
    $scope.customPlayerNames = PlayerNames.customPlayerNames;
    $scope.playerLine = 0;
    $scope.teamCategories = Teams.categories;
    $scope.maxMatchNumber = 0;
    $scope.teamsSet = 0;
    $scope.teamCriteria = TeamCriteria.criteria;
    $scope.matchMatrix = createMatchMatrix();
    $scope.playerInTeam = createPlayerInTeamArray();
    $scope.resultTeams = createResultTeamsArray();

    $scope.calculateWeight = function (playerX, answerIndex) {
      // iterate over all answers off polls[answerIndex], weight is high, when only few answers are the same as playerXs answer
      var similarAnswers = 0;
      var differentAnswers = 0;
      for (var i = 0; i < Polls.polls[answerIndex].answers.length; i++) {
        if (Polls.polls[answerIndex].answers[i] === Polls.polls[answerIndex].answers[playerX]) {
          similarAnswers++;
        } else if(Polls.polls[answerIndex].answers[i] != -1 && Polls.polls[answerIndex].answers[playerX] != -1) {
          differentAnswers++;
        }
      }
      // console.log("calcWeight for playerX: " + playerX + " and answerIndex: " + answerIndex + " similarAnswers: " + similarAnswers + " differentAnswers: " + differentAnswers); 
      if (similarAnswers === 2) {
        return 5;
      }
      if (similarAnswers <= differentAnswers) {
        return 3;
      } else {
        return 1;
      }
    };
  
    initialize();

    function createMatchMatrix() {
      return Array.from({ length: 15 }, () => Array.from({ length: 15 }, () => 0));
    }

    function createPlayerInTeamArray() {
      return Array.from({ length: 15 }, () => []);
    }

    function createResultTeamsArray() {
      return Array.from({ length: 15 }, () => []);
    }

    function initialize() {
      getMatrix();
      getMaxMatchNumber();
      assignTeams();
      console.log($scope.playerInTeam);
      console.log("Result teams: ");
      console.log($scope.resultTeams);
    }

    function getMatrix() {
      // console.log("matchMatrix-before= " + $scope.matchMatrix);
      for (var playerX = 0; playerX < $scope.matchMatrix.length; playerX++) {
        for (var playerY = 0; playerY < $scope.matchMatrix[playerX].length; playerY++) {
          for (var answerIndex = 0; answerIndex < Polls.polls.length; answerIndex++) {
            var diff = calculateDifference(playerX, playerY, answerIndex);
            var weight = $scope.calculateWeight(playerX, answerIndex);
            if (diff <= 1) {
              $scope.matchMatrix[playerX][playerY] += weight;
            }
            handlePlayerInGame(playerX, playerY);
          }
        }
      }
      console.log($scope.matchMatrix);
    }

    function calculateDifference(playerX, playerY, answerIndex) {
      var diff = 0;
      if (Polls.polls[answerIndex].answers[playerX] === -1 || Polls.polls[answerIndex].answers[playerY] === -1) {
        diff = 5;
      } else {
        diff = Math.abs(Polls.polls[answerIndex].answers[playerX] - Polls.polls[answerIndex].answers[playerY]);
      }
      if (Polls.polls[answerIndex].type === 'binary') {
        diff *= 5;
      }
      return diff;
    }

    function handlePlayerInGame(playerX, playerY) {
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

    function getMaxMatchNumber() {
      for (var playerX = 0; playerX < $scope.matchMatrix.length; playerX++) {
        for (var playerY = 0; playerY < $scope.matchMatrix[playerX].length; playerY++) {
          if ($scope.matchMatrix[playerX][playerY] > $scope.maxMatchNumber) {
            $scope.maxMatchNumber = $scope.matchMatrix[playerX][playerY];
          }
        }
      }
    }

    function assignTeams() {
      if ($scope.teamsSet < 7) {
        var foundMaxMatch = false;
        for (var playerX = 0; playerX < $scope.matchMatrix.length; playerX++) {
          for (var playerY = 0; playerY < $scope.matchMatrix[playerX].length; playerY++) {
            if (playerX !== playerY && $scope.playerInTeam[playerX].length === 0 && $scope.playerInTeam[playerY].length === 0) {
              if ($scope.matchMatrix[playerX][playerY] >= $scope.maxMatchNumber) {
                $scope.playerInTeam[playerX].push(playerY);
                $scope.playerInTeam[playerY].push(playerX);
                $scope.matchMatrix[playerX][playerY] = -1;
                $scope.matchMatrix[playerY][playerX] = -1;
                console.log("Matched: " + playerX + playerY);
                $scope.resultTeams[$scope.teamsSet * 2].push(playerX);
                $scope.resultTeams[$scope.teamsSet * 2 + 1].push(playerY);
                storeMatchingValues($scope.teamsSet * 2);
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
        assignTeams();
      } else {
        for (var index = 0; index < $scope.playerInTeam.length; index++) {
          if ($scope.playerInTeam[index].length === 0) {
            $scope.resultTeams[$scope.resultTeams.length - 1].push(index);
            return;
          }
        }
      }
    }

    function storeMatchingValues(teamIndex) {
      var playerX = $scope.resultTeams[teamIndex][0];
      var playerY = $scope.resultTeams[teamIndex + 1][0];
      console.log("Match " + playerX + " mit " + playerY);
      for (var questIndex = 0; questIndex < Polls.polls.length; questIndex++) {
        var questType = Polls.polls[questIndex].type;
        if (questType === 'binary') {
          if (Polls.polls[questIndex].answers[playerX] === Polls.polls[questIndex].answers[playerY] &&
            Polls.polls[questIndex].answers[playerX] !== -1 && Polls.polls[questIndex].answers[playerY] !== -1) {
            $scope.resultTeams[teamIndex].push(questIndex);
            $scope.resultTeams[teamIndex + 1].push(questIndex);
          }
        } else if (questType === 'fingers') {
          if (Polls.polls[questIndex].answers[playerX] !== -1 && Polls.polls[questIndex].answers[playerY] !== -1) {
            if (Math.abs(Polls.polls[questIndex].answers[playerX] - Polls.polls[questIndex].answers[playerY]) <= 1) {
              $scope.resultTeams[teamIndex].push(questIndex);
              $scope.resultTeams[teamIndex + 1].push(questIndex);
            }
          }
        }
      }
    }

    $scope.getResultTeams = function () {
      var resultTeamsInGame = [];
      for (var i = 0; i < $scope.resultTeams.length; i++) {
        if (PlayerNames.inGame[$scope.resultTeams[i][0]] === 1) {
          resultTeamsInGame.push($scope.resultTeams[i]);
        }
      }
      // console.log(resultTeamsInGame);
      return resultTeamsInGame;
    };

    $scope.getCritNote = function (playerIndex, questIndex) {
      // console.log("Get crit note: " + playerIndex + " " + questIndex);
      var player = playerIndex[0];
      var questType = Polls.polls[questIndex].type;
      if (questType === 'binary') {
        if (Polls.polls[questIndex].answers[player] === 1) {
          return gettextCatalog.getString(Polls.polls[questIndex].note) + ": +";
        } else if (Polls.polls[questIndex].answers[player] === 0) {
          return gettextCatalog.getString(Polls.polls[questIndex].note) + ": -";
        }
      } else if (questType === 'fingers') {
        if (Polls.polls[questIndex].answers[player] <= 2) {
          return gettextCatalog.getString(Polls.polls[questIndex].note) + ": -";
        } else {
          return gettextCatalog.getString(Polls.polls[questIndex].note) + ": +";
        }
      }
      return "";
    };

    $scope.mark = function (playerIndex, critIndex) {
      $scope.teamCriteria[critIndex] = Math.floor(playerIndex / 2);
    };

    $scope.unmark = function (playerIndex, critIndex) {
      $scope.teamCriteria[critIndex] = -1;
    };

    $scope.isMarked = function (playerIndex, critIndex) {
      return $scope.teamCriteria[critIndex] === Math.floor(playerIndex / 2);
    };

    $scope.isUsed = function (playerIndex, critIndex) {
      var teamIndex = Math.floor(playerIndex / 2);
      return $scope.teamCriteria[critIndex] !== teamIndex && $scope.teamCriteria[critIndex] !== -1;
    };

    $scope.playerFulfills = function (playerId) {
      var infoArray = [];
      var catIndex = $scope.playerInTeam[playerId][0];
      for (var questIndex = 0; questIndex < Teams.categories[catIndex].questionNr.length; questIndex++) {
        var questId = Teams.categories[catIndex].questionNr[questIndex];
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
      for (var questIndex = 0; questIndex < Polls.polls.length; questIndex++) {
        var questType = Polls.polls[questIndex].type;
        if (questType === 'binary') {
          if (Polls.polls[questIndex].answers[playerId] === 1) {
            infoArray.push(gettextCatalog.getString(Polls.polls[questIndex].note) + ": +");
          } else if (Polls.polls[questIndex].answers[playerId] === 0) {
            infoArray.push(gettextCatalog.getString(Polls.polls[questIndex].note) + ": -");
          }
        } else if (questType === 'fingers') {
          if (Polls.polls[questIndex].answers[playerId] !== -1) {
            infoArray.push(gettextCatalog.getString(Polls.polls[questIndex].note) + ": " + Polls.polls[questIndex].answers[playerId]);
          }
        }
      }
      return infoArray;
    }

    $scope.isMatched = function (playerX, playerY) {
      return Matches.matches[playerX][1] === playerY;
    };

    $scope.matchUp = function (playerX, playerY) {
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

    $scope.clearMatch = function (playerX, playerY) {
      console.log("Clear: " + playerX + " + " + playerY);
      Matches.matches[playerX][1] = playerX;
      Matches.matches[playerY][1] = playerY;
    };

    $scope.playerLineCount = function (val) {
      $scope.playerLine = val;
      return $scope.playerLine;
    };

    $scope.matchLastPlayer = function (index) {
      var playerIndex = index;
      var bestMatch = 0;
      var bestPartnerIndex = -1;
      for (var playerY = 0; playerY < $scope.matchMatrix[playerIndex].length; playerY++) {
        if (playerY !== playerIndex && $scope.matchMatrix[playerIndex][playerY] > bestMatch) {
          bestMatch = $scope.matchMatrix[playerIndex][playerY];
          bestPartnerIndex = playerY;
        }
      }
      if (bestMatch <= 0) {
        return gettextCatalog.getString("Doesn't match well. Should play alone.");
      } else {
        return gettextCatalog.getString('Matches best with the team of {{name1}} and {{name2}}.', {
          name1: $scope.customPlayerNames[bestPartnerIndex] || $scope.playerNames()[bestPartnerIndex],
          name2: $scope.customPlayerNames[$scope.playerInTeam[bestPartnerIndex]] || $scope.playerNames()[$scope.playerInTeam[bestPartnerIndex]]
        });
      }
    };

    $scope.getPlayerCount = function () {
      return PlayerNames.getPlayerCount();
    };


  }
})();
