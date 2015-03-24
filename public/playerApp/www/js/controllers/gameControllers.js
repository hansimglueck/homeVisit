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

