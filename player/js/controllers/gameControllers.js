(function() {
    'use strict';

    angular.module("gameControllers", [])
        .controller('ScoreController', function ($scope, Socket, Status, playerColors, ModalService) {
            $scope.socket = Socket;
            $scope.test = "HALLO WELT";
            $scope.status = {};
            $scope.minScore = 0;
            $scope.maxScore = 0;
            $scope.playerColors = playerColors;

            $scope.status.player = {
                playerId: 1,
                score: 60
            };
            $scope.status = Status;
            //$scope.color = "green";
            $scope.myColor = function () {
                return playerColors[Status.player.playerId];
            };
            $scope.showScore = function () {
                return Status.otherPlayers.filter(function (player) {
                    return player.score !== 0;
                }).length > 0;
            };
            $scope.baromaterHeight = 190;
            $scope.getBaroHeight = function () {
                return $scope.baromaterHeight.toString() + "px";
            };

            $scope.getLinePos = function (score) {
                return ($scope.linePosFromScore(score)).toString() + "px";
            };
            $scope.getLabelPos = function(index, length) {
                return [(index*4+20)+"px", (-index*2-14)+"px"];
            };
            $scope.getMyLinePos = function () {
                var myScore = $scope.status.player.score;
                return ($scope.linePosFromScore(myScore)).toString() + "px";
            };
            $scope.linePosFromScore = function (myScore) {
                return $scope.baromaterHeight - (myScore - Status.maxMinScore.min) * $scope.baromaterHeight / (Status.maxMinScore.max - Status.maxMinScore.min);
            };

            $scope.getPosHeight = function () {
                return ($scope.linePosFromScore(0)).toString() + "px";
            };
            $scope.getNegHeight = function () {
                return ($scope.baromaterHeight - $scope.linePosFromScore(0)).toString() + "px";
            };

            $scope.openGameEventModal = function () {
                // Just provide a template url, a controller and call 'showModal'.
                ModalService.showModal({
                    templateUrl: "views/game-events.html",
                    controller: "GameEventController"
                }).then(function (modal) {
                    // The modal object has the element built, if this is a bootstrap modal
                    // you can call 'modal' to show it, if it's a custom modal just show or hide
                    // it as you need to.
                    modal.element.modal();
                    modal.close.then(function (result) {
                        $scope.message = result ? "You said Yes" : "You said No";
                    });
                });

            };


        })
        .controller('GameEventController', function ($scope, Status) {
            $scope.status = Status;
            $scope.turn = navigator.platform.indexOf("arm")>-1;
            $scope.selectedType = "";
            $scope.selectType = function(type) {
                $scope.selectedType = type;
            };
            $scope.showScoringPlayers = false;
        })
        .controller('AssholesController', function($scope, playerColors, Home, Status){
            $scope.playerColors = playerColors;
            $scope.status = Status;
            $scope.home = Home;
            $scope.nothing = true;
            Home.assholeData.forEach(function(d) {
                if (d !== 0) {
                    $scope.nothing = false;
                    return false;
                }
            });
        })
        .controller('FreezeController', function($scope){

        });

})();
