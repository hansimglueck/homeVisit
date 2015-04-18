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
    });
