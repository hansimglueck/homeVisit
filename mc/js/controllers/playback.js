angular.module('homeVisitMCApp')
    .controller('PlaybackCtrl', function ($scope, Playback) {
        $scope.playback = Playback.playback;
        $scope.alert = Playback.alert;
    });
