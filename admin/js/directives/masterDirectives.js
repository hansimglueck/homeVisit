/**
 * Created by jeanbluer on 06.02.15.
 */
angular.module('masterDirectives', [])

    .directive('showDeviceList', function() {
        return {
            restrict: 'AE',
            replace: 'true',
            templateUrl: 'admin/views/show-device-list.html'
        };
    })
    .directive('masterButtons', function() {
        return {
            restrict: 'AE',
            replace: 'true',
            templateUrl: 'admin/views/master-buttons.html'
        };
    })
    .directive('logDisplay', function() {
        return {
            restrict: 'AE',
            replace: 'true',
            templateUrl: 'admin/views/log-display.html'
        };
    })
    .directive('masterContent', function() {
        return {
            restrict: 'AE',
            replace: 'true',
            templateUrl: 'admin/views/master-content.html'
        };
    })
    .directive('gameConf', function() {
        return {
            restrict: 'AE',
            replace: 'true',
            templateUrl: 'admin/views/game-conf.html'
        };
    })
    .directive('raspiManager', function() {
        return {
            restrict: 'AE',
            replace: 'true',
            templateUrl: 'admin/views/raspi-manager.html'
        };
    })
    .directive('playerList', function() {
        return {
            restrict: 'AE',
            replace: 'true',
            templateUrl: 'admin/views/player-list.html'
        };
    });
