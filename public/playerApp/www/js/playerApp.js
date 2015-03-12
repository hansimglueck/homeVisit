'use strict';

angular.module('playerApp', [
    'ngRoute',
    'playerControllers',
    'WebsocketServices',
    'mobile-angular-ui',
    'mobile-angular-ui.gestures',
    'chart.js',
    'ngCookies',
    'playerAppServices',
    'playerAppDirectives'
])
    .config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.
                when('/home', {
                    templateUrl: 'partials/home.html',
                    controller: 'HomeController'
                }).
                when('/rating', {
                    templateUrl: 'partials/rating.html',
                    controller: 'RatingController'
                }).
                when('/chat', {
                    templateUrl: 'partials/chat.html',
                    controller: 'ChatController'
                }).
                when('/chat/:playerId', {
                    templateUrl: 'partials/playerChat.html',
                    controller: 'PlayerChatController'
                }).
                 when('/europe', {
                    templateUrl: 'partials/europe.html',
                    controller: 'EuropeController'
                }).
                otherwise({
                    redirectTo: '/home'
                });
        }]);
;


