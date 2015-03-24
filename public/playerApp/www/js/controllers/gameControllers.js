angular.module("gameControllers", [])
    .controller('ScoreController', function ($scope, Socket, Status) {
        $scope.socket = Socket;
        $scope.test = "HALLO WELT";
        $scope.status = {};
        $scope.status.otherPlayers = [
            {
                playerId: 0,
                score: 80
            },
            {
                playerId: 1,
                score: 30
            }
        ];
        $scope.status = Status;
    })
    .controller('DonationController', function ($scope, Socket, $routeParams, Status, colors, $location) {
        $scope.colors = colors;
        $scope.itemId = $routeParams.itemId;
        $scope.status = Status;
        $scope.donate = function(playerId, itemId) {
            if (!confirm("Wirklich an Spieler "+playerId+ "geben?")) return;
            console.log("Donate it!");
            Socket.emit({
                type: "donation",
                recipient: playerId,
                itemId: itemId
            });
            $location.url("/score");
        };

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

