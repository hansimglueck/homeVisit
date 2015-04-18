angular.module('playerAppDirectives', [])

    .directive('notJoined', function () {
        return {
            restrict: 'AE',
            replace: 'true',
            templateUrl: 'views/not-joined.html'
        };
    })
    .directive('europeMap', function () {
        return {
            restrict: 'AE',
            replace: 'true',
            templateUrl: 'views/europe.html'
        };
    })
    .directive('playerIcon', function () {
        return {
            restrict: 'AE',
            replace: 'true',
            scope: {
                playerId: '=pid'
            },
            controller: function($scope, playerColors) {
                $scope.playerColors = playerColors;
            },
            templateUrl: 'views/player-icon.html'
        };
    });
