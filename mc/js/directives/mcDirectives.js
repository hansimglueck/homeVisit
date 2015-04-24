angular.module('mcDirectives', [])
    .directive('playback', function () {
        return {
            restrict: 'AE',
            replace: 'true',
            templateUrl: '/mc/views/playback.html',
            controller: "PlaybackCtrl"
        };
    })
    .directive('deck', function () {
        return {
            restrict: 'AE',
            replace: 'true',
            templateUrl: '/mc/views/deck.html',
            controller: "DeckCtrl"
        };
    })
    .directive('item', function() {
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: '/mc/views/item.html',
            controller: 'ItemCtrl',
            scope: {},
            link: function($scope, $element, $attributes) {
                $scope.indexOffset = parseInt($attributes['indexOffset']);
            }
        };
    });
