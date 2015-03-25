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
    .controller('DonationController', function ($scope, Socket, $routeParams, Status, colors, $location) {
        $scope.colors = colors;
        $scope.itemId = $routeParams.itemId;
        $scope.status = Status;
        $scope.donate = function(playerId, playerColors, itemId) {
            if (!confirm("Wirklich an Spieler "+ playerColors[0] + "-" + playerColors[1] + " geben?")) return;
            console.log("Donate it!");
            Socket.emit({
                type: "donation",
                recipient: playerId,
                itemId: itemId
            });
            $location.url("/score");
        };
        
        $scope.textForItemId = function(id) {
            var text = "";
            if (id == 0) {
                text = "PLUS";
            } else {
                text = "MINUS";
            }
            return text;
        }
        
        $scope.getPlayersOrdered = function() {
            var players = $scope.status.otherPlayers.filter(function(p){return p.joined;});
            var ordered = [];
            var mySeat = players.map(function(p,id){return {id:id, playerId: p.playerId}}).filter(function(pp){return pp.playerId == Status.player.playerId})[0].id;
            var oppositeSeat = (mySeat + Math.floor(players.length/2))%players.length;
            var seat;
            var p = null;
            for (var i = 0; i < players.length; i++) {
                if (i%2 == 1) {
                    //rechts rum
                    seat = oppositeSeat + Math.ceil(i/2);
                } else {
                    //links rum
                    seat = oppositeSeat - Math.floor(i/2);
                }
                seat += players.length;
                seat %= players.length;
                p = getPlayerForSeat(seat);
                if (p!= null) if(p.playerId != Status.player.playerId) ordered.push(p);
            }
            return ordered;
        };
        function getPlayerForSeat(id) {
            var arr = $scope.status.otherPlayers.filter(function(p){return p.joined});
            if (arr.length > 0) return arr[id];
            else return null;
        }
    });

