angular.module('playerAppDirectives', [])

    .directive('notJoined', function() {
        return {
            restrict: 'AE',
            replace: 'true',
            templateUrl: 'views/not-joined.html'
        };
    });
