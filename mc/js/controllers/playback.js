(function() {
    'use strict';

    angular.module('homeVisitMCApp')
        .controller('PlaybackCtrl', function ($scope, Playback, Clock) {
            $scope.playback = Playback.playback;
            $scope.alert = Playback.alert;
            $scope.clock = Clock;
        });

})();
