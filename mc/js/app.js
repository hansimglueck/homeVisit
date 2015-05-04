'use strict';

/**
 * @ngdoc overview
 * @name homeVisitMCApp
 * @description
 * # homeVisitMCApp
 *
 * Main module of the application.
 */
angular
    .module('homeVisitMCApp', [
        'ngAnimate',
        'ngResource',
        'ngRoute',
        'WebsocketServices',
        'mcAppServices',
        'hvPlayerColors',
        'playerDirectives',
        'mcDirectives',
        'hvSetFactory',
        'hvItemOptions',
        'hvLanguage',
        'angularModalService',
        'gettext',
        'chart.js'
    ])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                redirectTo: '/polls'
            })
            .when('/polls', {
                templateUrl: '/mc/views/dummies.html',
                controller: 'DummiesCtrl'
            })
            .when('/players', {
                templateUrl: '/mc/views/players.html',
                controller: 'PlayersCtrl'
            })
            .when('/players/playback', {
                templateUrl: '/mc/views/players.html',
                controller: 'PlayersCtrl'
            })
            .when('/players/:playerId', {
                templateUrl: '/mc/views/players.html',
                controller: 'PlayersCtrl'
            })
            .when('/matching', {
                templateUrl: '/mc/views/matching.html',
                controller: 'MatchingCtrl'
            })
            .when('/deck', {
                templateUrl: '/mc/views/deck.html',
                controller: 'DeckCtrl'
            })
            .when('/about', {
                templateUrl: '/mc/views/about.html',
                controller: 'MatchingCtrl'
            })
            .when('/maintenance', {
                templateUrl: '/mc/views/maintenance.html',
                controller: 'PlaybackCtrl'
            })
            .when('/results', {
                templateUrl: '/mc/views/results.html',
                controller: 'ResultsController'
            })
            .otherwise({
                redirectTo: '/'
            });
    })
    .run(function (Socket, Status, Deck, TeamActionInfo, gettextCatalog) {
        Socket.connect('MC', function() {
            Socket.emit('getLanguage');
        });
        Status.start();
        Deck.start();
        TeamActionInfo.start();
        Socket.on('languageChange', function (data) {
            gettextCatalog.setCurrentLanguage(data.language);
        });
    });
