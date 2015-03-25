'use strict';

angular.module('mcApp', [
    'ngRoute',
    'mcControllers',
    'WebsocketServices',
    'mobile-angular-ui'
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
                otherwise({
                    redirectTo: '/home'
                });
        }]);
;


