(function() {
    'use strict';

    angular.module('homeVisitMCApp')
        .controller('PlaybackCtrl', function ($scope, Playback, Clock, gameSessionsFactory) {
            $scope.playback = Playback.playback;
            $scope.alert = Playback.alert;
            $scope.clock = Clock;
            $scope.sessions = gameSessionsFactory;
        });

})();
