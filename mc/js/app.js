(function() {
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
        'chart.js',
        'hvDirectives',
        'ui.bootstrap',
        'hvBrainControl',
        'hvGameControl'

    ])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                redirectTo: '/settings'
            })
            .when('/polls', {
                templateUrl: '/mc/views/dummies.html',
                controller: 'DummiesCtrl'
            })
            .when('/matching', {
                templateUrl: '/mc/views/matching.html',
                controller: 'MatchingCtrl'
            })
            .when('/matchingNew', {
                templateUrl: '/mc/views/matchingNew.html',
                controller: 'MatchingNewCtrl'
            })
            .when('/deck', {
                templateUrl: '/mc/views/deck.html',
                controller: 'DeckCtrl'
            })
            .when('/settings', {
                templateUrl: '/mc/views/settings.html',
                controller: 'PlaybackCtrl'
            })
            .when('/results', {
                templateUrl: '/mc/views/results.html',
                controller: 'ResultsController'
            })
            .when('/script', {
                templateUrl: '/mc/views/script.html',
                controller: 'ScriptCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    })
    .run(function (Socket, Status, Deck, TeamActionInfo, gettextCatalog, gameSessionsFactory, Display, SystemInfo, $anchorScroll, GameControlFactory) {
        Socket.on('languageChange', function (data) {
            gettextCatalog.setCurrentLanguage(data.language);
        });
        Socket.connect('MC', function() {
            Socket.emit('getLanguage');
            Socket.emit('getGameSessions');
            SystemInfo.start();
        });
        Status.start();
        Deck.start();
        TeamActionInfo.start();
        gameSessionsFactory.start();
        GameControlFactory.start();
        Display.start();
        //$anchorScroll.yOffset = 250;
    });

})();
