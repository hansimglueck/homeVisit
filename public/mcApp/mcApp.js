'use strict';

angular.module('mcApp', [
    'ngRoute',
    'mcControllers',
    'WebsocketServices',
    'mcServices'
])
    .config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.
                when('/alarm', {
                    templateUrl: '/mcApp/partials/alarm.html',
                    controller: 'AlarmController'
                }).
                when('/home', {
                    templateUrl: '/mcApp/partials/home.html',
                    controller: 'HomeController'
                }).
                when('/home/:playerId', {
                    templateUrl: '/mcApp/partials/player.html',
                    controller: 'PlayerController'
                }).
                otherwise({
                    redirectTo: '/home'
                });
        }]);
;


