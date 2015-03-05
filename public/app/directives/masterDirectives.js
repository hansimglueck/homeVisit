/**
 * Created by jeanbluer on 06.02.15.
 */
angular.module('masterDirectives', [])

    .directive('showDeviceList', function() {
        return {
            restrict: 'AE',
            replace: 'true',
            templateUrl: 'app/views/show-device-list.html'
        };
    })
    .directive('masterButtons', function() {
        return {
            restrict: 'AE',
            replace: 'true',
            templateUrl: 'app/views/master-buttons.html'
        };
    })
    .directive('logDisplay', function() {
        return {
            restrict: 'AE',
            replace: 'true',
            templateUrl: 'app/views/log-display.html'
        };
    })
    .directive('masterContent', function() {
        return {
            restrict: 'AE',
            replace: 'true',
            templateUrl: 'app/views/master-content.html'
        };
    })
    .directive('gameConf', function() {
        return {
            restrict: 'AE',
            replace: 'true',
            templateUrl: 'app/views/game-conf.html'
        };
    })
    .directive('raspiManager', function() {
        return {
            restrict: 'AE',
            replace: 'true',
            templateUrl: 'app/views/raspi-manager.html'
        };
    })
    .directive('playerList', function() {
        return {
            restrict: 'AE',
            replace: 'true',
            templateUrl: 'app/views/player-list.html'
        };
    });
