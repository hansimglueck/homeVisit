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
    'ngAudio'
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
                when('/test', {
                    templateUrl: 'partials/test.html',
                    controller: 'TestController'
                }).
                otherwise({
                    redirectTo: '/home'
                });
        }]);
;


