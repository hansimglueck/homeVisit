'use strict';

angular.module('playerApp', [
    'ngRoute',
    'playerControllers',
    'WebsocketServices',
    'mobile-angular-ui',
    'mobile-angular-ui.gestures',
    'chart.js',
    'ngCookies',
    'playerAppServices'
])
    .config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.
                when('/rating', {
                    templateUrl: 'playerApp/partials/rating.html',
                    controller: 'RatingController'
                }).
                when('/chat', {
                    templateUrl: 'playerApp/partials/chat.html',
                    controller: 'ChatController'
                }).
                when('/vote', {
                    templateUrl: 'playerApp/partials/vote.html',
                    controller: 'VoteController'
                }).
                otherwise({
                    redirectTo: '/rating'
                });
        }]);
;


