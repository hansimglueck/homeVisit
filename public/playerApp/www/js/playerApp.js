'use strict';

angular.module('playerApp', [
    'ngRoute',
    'playerControllers',
    'gameControllers',
    'WebsocketServices',
    'mobile-angular-ui',
    'mobile-angular-ui.gestures',
    'chart.js',
    'ngCookies',
    'playerAppServices',
    'playerAppDirectives',
    'ngCordova',
    'ngAnimate',
    'ngAudio',
    'fxControllers',
    'europeSVG',
    'uuid'
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
                when('/motion', {
                    templateUrl: 'partials/motion.html',
                    controller: 'MotionController'
                }).
                when('/arduino', {
                    templateUrl: 'partials/arduino.html',
                    controller: 'ArduinoController'
                }).
                when('/info', {
                    templateUrl: 'partials/info.html',
                    controller: 'InfoController'
                }).
                when('/score', {
                    templateUrl: 'partials/score.html',
                    controller: 'ScoreController'
                }).
                when('/score/donate/:itemId', {
                    templateUrl: 'partials/donate.html',
                    controller: 'DonationController'
                }).
                when('/vote', {
                    templateUrl: 'partials/vote.html',
                    controller: 'VoteController'
                }).
                when('/voteConfirm', {
                    templateUrl: 'partials/voteConfirm.html',
                    controller: 'VoteController'
                }).
                when('/voteFinished', {
                    templateUrl: 'partials/voteFinished.html',
                    controller: 'VoteController'
                }).
                when('/deal', {
                    templateUrl: 'partials/deal.html',
                    controller: 'DealsController'
                }).
                when('/deal/:subject', {
                    templateUrl: 'partials/deal.html',
                    controller: 'DealsController'
                }).
                when('/deal/new/:subject', {
                    templateUrl: 'partials/deal.html',
                    controller: 'DealsController'
                }).
                otherwise({
                    redirectTo: '/home'
                });
        }]);



