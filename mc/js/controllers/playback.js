(function() {
    'use strict';

    angular.module('homeVisitMCApp')
        .controller('PlaybackCtrl', function ($scope, Playback, Deck) {
            $scope.playback = Playback.playback;
            $scope.alert = Playback.alert;
            $scope.clock = function() {
                var secs = Deck.clockSeconds, minutes, hours;

                // test values here:
                // secs = 0; // 0:10h
                // secs = 59; // 0:00h
                // secs = 60; // 0:01h
                // secs = 10 * 60; // 0:10h
                // secs = 60 * 60; // 1:00h
                // secs = 61 * 60; // 1:01h
                // secs = 119 * 60; // 1:59h
                // secs = 120 * 60; // 2:00h
                // secs = 121 * 60; // 2:01h

                if (typeof secs !== 'number') {
                    minutes = 0;
                    hours = 0;
                }
                else {
                    minutes = Math.floor(secs / 60 % 60);
                    hours = Math.floor((secs / 60 - minutes) / 60);
                }
                return String(hours) + ':' +
                    (String(minutes).length < 2 ? '0' : '') +
                    String(minutes);
            };
        });

})();
