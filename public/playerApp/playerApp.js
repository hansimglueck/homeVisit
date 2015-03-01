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
                    templateUrl: 'playerApp/partials/home.html',
                    controller: 'HomeController'
                }).
                when('/rating', {
                    templateUrl: 'playerApp/partials/rating.html',
                    controller: 'RatingController'
                }).
                when('/chat', {
                    templateUrl: 'playerApp/partials/chat.html',
                    controller: 'ChatController'
                }).
                when('/chat/:playerId', {
                    templateUrl: 'playerApp/partials/playerChat.html',
                    controller: 'PlayerChatController'
                }).
                when('/vote', {
                    templateUrl: 'playerApp/partials/vote.html',
                    controller: 'VoteController'
                }).
                otherwise({
                    redirectTo: '/home'
                });
        }]);
;


