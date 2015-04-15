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
                when('/europe', {
                    templateUrl: 'partials/europe.html',
                    controller: 'EuropeController'
                }).
                when('/score', {
                    templateUrl: 'partials/score.html',
                    controller: 'ScoreController'
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



