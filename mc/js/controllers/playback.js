(function() {
    'use strict';

    angular.module('homeVisitMCApp')
        .controller('PlaybackCtrl', function ($scope, Playback, Clock, gameSessionsFactory) {
            $scope.playback = Playback.playback;
            $scope.alert = Playback.alert;
            $scope.clock = Clock;
            $scope.session = gameSessionsFactory;
            // $scope.$watch('session', function() {
            //     console.log('111 session change!');
            // });
            // $scope.$on('sessionChange', function() {
            //     console.log('session change!');
            //     $scope.session = gameSessionsFactory.currentSession;
            // });
        });

})();
