angular.module('playerDirectives', [])
    .directive('playerDetails', function () {
        return {
            restrict: 'AE',
            replace: 'true',
            scope: {
                playerId: '=pid'
            },
            templateUrl: '/mc/views/player.details.html',
            controller: "PlayerDetailsCtrl"
        };
    });
