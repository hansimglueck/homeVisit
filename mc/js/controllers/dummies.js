/* global prompt */

(function() {
    'use strict';

    angular.module('homeVisitMCApp')
        .controller('DummiesCtrl', function ($scope, Polls, ModalService, PlayerNames, gettextCatalog) {
            $scope.gettextCatalog = gettextCatalog;
            $scope.selectedRow = Polls.selectedPoll;
            $scope.playerNames = PlayerNames.getNames;
            $scope.customPlayerNames = PlayerNames.customPlayerNames;
            $scope.dummies = [
                {top: 10, left: 189},
                {top: 10, left: 377},
                {top: 10, left: 565},
                {top: 10, left: 753},
                {top: 10, left: 941},
                {top: 60, left: 1110},
                {top: 250, left: 1110},
                {top: 440, left: 1110},
                {top: 490, left: 941},
                {top: 490, left: 753},
                {top: 490, left: 565},
                {top: 490, left: 377},
                {top: 490, left: 189},
                {top: 440, left: 20},
                {top: 250, left: 20}
            ];
            $scope.p = PlayerNames;

            // When there are less than 15 players, deactivate them to ignore them in matching calc
            // 1 if player is in game, 0 if player is absent
            $scope.inGame = PlayerNames.inGame;

            $scope.polls = Polls;
            $scope.selectRow = function(id){
                $scope.selectedRow = id;
                Polls.selectedPoll = id;
                if (Polls.polls[id].type === "fingers" && $scope.isInGame(PlayerNames.hostId)) $scope.pollPopup();
                //Polls.selectedPoll = id;
            };
            $scope.setHost = function(hid) {
                PlayerNames.hostId = hid;
            };
            $scope.pollPopup = function() {
                ModalService.showModal({
                    templateUrl: "views/pollPopup.html",
                    controller: "PollPopupController",
                    inputs: {
                        startId: PlayerNames.hostId,
                        selectAnswer: $scope.selectAnswer,
                        isInGame: $scope.isInGame
                    }
                }).then(function (modal) {
                    // The modal object has the element built, if this is a bootstrap modal
                    // you can call 'modal' to show it, if it's a custom modal just show or hide
                    // it as you need to.
                    modal.element.modal({
                        backdrop: false
                    });
                });

            };
            $scope.selectAnswer = function(did, aid) {
                console.log("select answer "+aid+" for "+did);
                if ($scope.inGame[did] === 0) {
                    return;
                }
                if (Polls.polls[$scope.selectedRow].answers[did] === aid) {
                    $scope.polls.polls[$scope.selectedRow].answers[did] = -1;
                } else {
                    $scope.polls.polls[$scope.selectedRow].answers[did] = aid;
                }
            };
            $scope.selectAllUnanswered = function (val) {
                for (var index = 0; index < Polls.polls[0].answers.length; index++) {
                    if (Polls.polls[$scope.selectedRow].answers[index] === -1 /*&& $scope.inGame[index] === 1*/) {
                        Polls.polls[$scope.selectedRow].answers[index] = val;
                    }
                }
            };
            $scope.showPlusMinus = function(x) {
                if (x === 0) {
                    return "-";
                }
                if (x === 1) {
                    return "+";
                }
                return "";
            };
            $scope.showFingers = function(x) {
                if (x === -1) {
                    return "";
                } else {
                    return x;
                }
            };
            $scope.unanswered = function(did){
                return typeof $scope.polls.polls[$scope.selectedRow].answers[did] === 'undefined';
            };
            $scope.setName = function(nr) {
                var name = prompt(gettextCatalog.getString('Change name'), PlayerNames.getNames()[nr]);
                if (name != null){
                    PlayerNames.customPlayerNames[nr] = name;
                    $scope.inGame[nr] = 1;
                }
            };
            $scope.isInGame = function(playerIndex) {
                if ($scope.inGame[playerIndex] == 1) {
                    return true;
                } else {
                    return false;
                }
            };
            $scope.toggleIsInGame = function(playerIndex) {
                if ($scope.inGame[playerIndex] === 1) {
                    //$scope.polls.polls[$scope.selectedRow].answers[playerIndex] = -1;
                    $scope.inGame[playerIndex] = 0;
                } else {
                    $scope.inGame[playerIndex] = 1;
                }
            }
        });

})();
