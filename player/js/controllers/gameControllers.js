angular.module("gameControllers", [])
    .controller('ScoreController', function ($scope, Socket, Status, playerColors, ModalService) {
        $scope.socket = Socket;
        $scope.test = "HALLO WELT";
        $scope.status = {};
        $scope.minScore = 0;
        $scope.maxScore = 0;
        $scope.status.otherPlayers = [
            {
                playerId: 1,
                score: -10
            },
            {
                playerId: 2,
                score: 50
            },
            {
                playerId: 3,
                score: 80
            },
            {
                playerId: 4,
                score: 30
            }
        ];
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
            return (Status.otherPlayers.filter(function (player) {
                return player.score != 0
            }).length > 0);
        };
        $scope.baromaterHeight = 200;
        $scope.getBaroHeight = function () {
            return $scope.baromaterHeight.toString() + "px";
        };

        $scope.getLinePos = function (index) {
            $scope.minScore = $scope.status.otherPlayers[0].score;
            $scope.maxScore = $scope.status.otherPlayers[0].score;
            for (var i = 0; i < $scope.status.otherPlayers.length; i++) {
                if ($scope.status.otherPlayers[i].score < $scope.minScore) {
                    $scope.minScore = $scope.status.otherPlayers[i].score;
                }
                if ($scope.status.otherPlayers[i].score > $scope.maxScore) {
                    $scope.maxScore = $scope.status.otherPlayers[i].score;
                }
            }
            if ($scope.status.player.score < $scope.minScore) {
                $scope.minScore = $scope.status.player.score;
            }
            if ($scope.status.player.score > $scope.maxScore) {
                $scope.maxScore = $scope.status.player.score;
            }
            var myScore = $scope.status.otherPlayers[index].score;
            return ($scope.linePosFromScore(myScore)).toString() + "px";
        };
        $scope.getMyLinePos = function () {
            var myScore = $scope.status.player.score;
            return ($scope.linePosFromScore(myScore)).toString() + "px";
        };
        $scope.linePosFromScore = function (myScore) {
            var linePos = $scope.baromaterHeight - ((myScore - $scope.minScore) * $scope.baromaterHeight / ($scope.maxScore - $scope.minScore));
            return linePos;
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
    })
    .controller('FreezeController', function($scope){

    })
;

