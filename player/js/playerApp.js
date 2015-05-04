(function() {
    'use strict';

    angular.module('playerApp', [
        'ngRoute',
        'playerControllers',
        'gameControllers',
        'dealControllers',
        'ratingControllers',
        'WebsocketServices',
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
        'angularModalService',
        'gettext'
    ])
        .config(['$routeProvider',
                 function ($routeProvider) {
                     $routeProvider.
                         when('/home', {
                             templateUrl: 'partials/home.html',
                             controller: 'HomeController'
                         }).
                         when('/rating/done', {
                             templateUrl: 'partials/rating/rating.done.html',
                             controller: 'RatingController'
                         }).
                         when('/rating/score/:playerId', {
                             templateUrl: 'partials/rating/rating.score.html',
                             controller: 'RateScoreController'
                         }).
                         when('/rating/player/:score', {
                             templateUrl: 'partials/rating/rating.player.html',
                             controller: 'RatePlayerController'
                         }).
                         when('/rating/:playerId/:score', {
                             templateUrl: 'partials/rating/rating.html',
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
                         when('/deal', {
                             templateUrl: 'partials/deals/deal.choosePlayer.html',
                             controller: 'ChooseDealPlayerController'
                         }).
                         when('/deal/messageSent/:playerId', {
                             templateUrl: 'partials/deals/deal.messageSent.html',
                             controller: 'DealDetailsController'
                         }).
                         when('/deal/new/:playerId', {
                             templateUrl: 'partials/deals/deal.new.html',
                             controller: 'DealDetailsController'
                         }).
                         when('/deal/answer/:playerId', {
                             templateUrl: 'partials/deals/deal.answer.html',
                             controller: 'DealDetailsController'
                         }).
                         when('/deal/wait/:playerId', {
                             templateUrl: 'partials/deals/deal.wait.html',
                             controller: 'DealDetailsController'
                         }).
                         when('/deal/finish/:playerId', {
                             templateUrl: 'partials/deals/deal.finish.html',
                             controller: 'DealDetailsController'
                         }).
                         when('/sound', {
                             templateUrl: 'partials/sound.html',
                             controller: 'SoundController'
                         }).
                         when('/black', {
                             templateUrl: 'partials/black.html',
                             controller: 'BlackController'
                         }).
                         when('/assholes', {
                             templateUrl: 'partials/assholes.html',
                             controller: 'AssholesController'
                         }).
                         when('/freeze', {
                             templateUrl: 'partials/freeze.html',
                             controller: 'FreezeController'
                         }).
                         when('/card', {
                             templateUrl: 'partials/card.html',
                             controller: 'CardController'
                         }).
                         otherwise({
                             redirectTo: '/home'
                         });
                 }])
        .run(function(Socket, Home, gettextCatalog) {
            Home.start();
            Socket.connect('player', function() {
                Socket.emit('getLanguage');
            });
            Socket.on('languageChange', function(data) {
                gettextCatalog.setCurrentLanguage(data.language);
            });
        });

})();
