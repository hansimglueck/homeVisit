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
        'gettext'
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
            .when('/emergency', {
                templateUrl: '/mc/views/emergency.html',
                controller: 'PlaybackCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    })
    .run(function(gettextCatalog) {
        // TODO: this has to come from server!
        gettextCatalog.setCurrentLanguage('de');
    })
    .run(function (Socket, Status, Deck) {
        Socket.connect('MC');
        Status.start();
        Deck.start();
    });
