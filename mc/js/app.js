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
    'ngTouch',
    'WebsocketServices',
    'playerAppServices'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: '/mc/views/dummies.html',
        controller: 'DummiesCtrl'
      })
        .when('/players', {
          templateUrl: '/mc/views/players.html',
          controller: 'PlayersCtrl'
        })
        .when('/matching', {
          templateUrl: '/mc/views/matching.html',
          controller: 'MatchingCtrl'
        })
      .otherwise({
        redirectTo: '/'
      });
  });
