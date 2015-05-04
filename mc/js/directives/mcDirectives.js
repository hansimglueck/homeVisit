(function() {
    'use strict';

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
                    $scope.indexOffset = parseInt($attributes.indexOffset);
                }
            };
        })
        .directive('gameSessionChooser', function() {
            return {
                restrict: 'E',
                replace: 'true',
                templateUrl: '/mc/views/game-session-chooser.html',
                controller: function ($scope, gameSessionsFactory, $rootScope, Socket) {
                    $scope.sessions = gameSessionsFactory;
                    $scope.setSession = function() {
                        Socket.emit('setGameSession', gameSessionsFactory.currentSession);
                        $rootScope.$broadcast('sessionChange');
                    };
                },
                scope: {}
            };
        });

})();
