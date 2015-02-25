angular.module('playerAppDirectives', [])

    .directive('notJoined', function() {
        return {
            restrict: 'AE',
            replace: 'true',
            templateUrl: 'playerApp/views/not-joined.html'
        };
    });
