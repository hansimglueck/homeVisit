(function() {
    'use strict';

    var baseUrl = '/admin/views';

    angular.module('masterDirectives', [])

        .directive('showDeviceList', function() {
            return {
                restrict: 'AE',
                replace: 'true',
                templateUrl: baseUrl + '/show-device-list.html'
            };
        })
        .directive('masterButtons', function() {
            return {
                restrict: 'AE',
                replace: 'true',
                templateUrl: baseUrl + '/master-buttons.html'
            };
        })
        .directive('logDisplay', function() {
            return {
                restrict: 'AE',
                replace: 'true',
                templateUrl: baseUrl + '/log-display.html'
            };
        })
        .directive('gameConf', function() {
            return {
                restrict: 'AE',
                replace: 'true',
                templateUrl: baseUrl + '/game-conf.html'
            };
        })
         .directive('playerList', function() {
            return {
                restrict: 'AE',
                replace: 'true',
                templateUrl: baseUrl + '/player-list.html'
            };
        })
         .directive('masterMind', function() {
            return {
                restrict: 'E',
                replace: 'true',
                templateUrl: baseUrl + '/master-mind.html'
            };
        });

})();
