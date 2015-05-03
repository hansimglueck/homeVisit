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
        .directive('masterContent', function() {
            return {
                restrict: 'AE',
                replace: 'true',
                templateUrl: baseUrl + '/master-content.html'
            };
        })
        .directive('gameConf', function() {
            return {
                restrict: 'AE',
                replace: 'true',
                templateUrl: baseUrl + '/game-conf.html'
            };
        })
        .directive('raspiManager', function() {
            return {
                restrict: 'AE',
                replace: 'true',
                templateUrl: baseUrl + '/raspi-manager.html'
            };
        })
        .directive('playerList', function() {
            return {
                restrict: 'AE',
                replace: 'true',
                templateUrl: baseUrl + '/player-list.html'
            };
        });

})();
