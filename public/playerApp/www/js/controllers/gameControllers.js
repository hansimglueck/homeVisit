angular.module("gameControllers", [])
    .controller('TestController', function ($scope) {
        $scope.test = "HALLO WELT";
        $scope.data = [
            {
                playerId: 0,
                score: 80
            },
            {
                playerId: 1,
                score: 30
            }
        ];
    });
