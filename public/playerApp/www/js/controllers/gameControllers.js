angular.module("gameControllers", [])
    .controller('ScoreController', function ($scope, Socket, Status) {
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
        
        $scope.baromaterHeight = 330;
        $scope.getBaroHeight = function() {
            return $scope.baromaterHeight.toString() + "px";
        }
        
        $scope.getLinePos = function(index) {
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
        }
        $scope.getMyLinePos = function() {
            var myScore = $scope.status.player.score;
            return ($scope.linePosFromScore(myScore)).toString() + "px";
        }
        $scope.linePosFromScore = function(myScore) {
            var linePos = $scope.baromaterHeight - ((myScore - $scope.minScore) * $scope.baromaterHeight / ($scope.maxScore - $scope.minScore));
            return linePos;
        }
        
        $scope.getPosHeight = function() {
            return ($scope.linePosFromScore(0)).toString() + "px";
        }
        $scope.getNegHeight = function() {
            return ($scope.baromaterHeight - $scope.linePosFromScore(0)).toString() + "px";
        }
    })
    .controller('DonationController', function ($scope, Socket, $routeParams) {
        $scope.itemId = $routeParams.itemId;
        $scope.donate = function(playerId, itemId) {
            if (!confirm("Wirklich an Spieler "+playerId+ "geben?")) return;
            console.log("Donate it!");
            Socket.emit({
                type: "donation",
                recipient: playerId,
                itemId: itemId
            });
        };
    });

