(function() {
    'use strict';

    angular.module('homeVisitMCApp')
        .controller('PlaybackCtrl', function ($scope, Playback, Clock, Deck, gameSessionsFactory) {
            $scope.playback = Playback.playback;
            $scope.alert = Playback.alert;
            $scope.clock = Clock;
            $scope.session = gameSessionsFactory;
            $scope.deck = Deck;
            $scope.collapsed = {
                info: true
            }
        });

})();
