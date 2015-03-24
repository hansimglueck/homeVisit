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
    .directive('playerDisplay', function () {
        return {
            restrict: 'AE',
            replace: 'true',
            scope: {
                goto: '=',
                players: '=',
                colors: '='
            },
            templateUrl: 'views/player-display.html'
        };
    });
