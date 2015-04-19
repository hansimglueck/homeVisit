'use strict';

angular.module('playerApp', [
    'ngRoute',
    'playerControllers',
    'gameControllers',
    'dealControllers',
    'WebsocketServices',
//    'mobile-angular-ui',
//    'mobile-angular-ui.gestures',
    'chart.js',
    'ngCookies',
    'playerAppServices',
    'playerAppDirectives',
    'ngAnimate',
    'ngAudio',
    'fxControllers',
    'europeSVG',
    'uuid',
    'hvPlayerColors',
    'angularModalService'
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
                when('/results', {
                    templateUrl: 'partials/results.html',
                    controller: 'ResultsController'
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
                when('/deals', {
                    templateUrl: 'partials/deals/deal.html',
                    controller: 'DealsController'
                }).
                when('/deals/new', {
                    templateUrl: 'partials/deals/deal.chooseSubject.html',
                    controller: 'ChooseDealSubjectController'
                }).
                when('/deals/new/:subject', {
                    templateUrl: 'partials/deals/deal.choosePlayer.html',
                    controller: 'ChooseDealPlayerController'
                }).
                when('/deals/new/:subject/:playerId', {
                    templateUrl: 'partials/deals/deal.new.html',
                    controller: 'NewDealController'
                }).
                when('/deals/:id', {
                    templateUrl: 'partials/deals/deal.details.html',
                    controller: 'DealDetailsController'
                }).
                when('/sound', {
                    templateUrl: 'partials/sound.html',
                    controller: 'SoundController'
                }).
                otherwise({
                    redirectTo: '/home'
                });
        }])
    .run(function(Socket, Home){
        Home.start();
        Socket.connect('player');
    })
;



