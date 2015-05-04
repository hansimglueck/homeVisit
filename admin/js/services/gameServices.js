(function() {
    'use strict';

    var gameServices = angular.module('gameServices', ['ngResource']);

    gameServices
        .factory('Game', function ($resource) {
            return $resource('/decks/:id', null, {
                'update': {method: 'PUT'}
            });
            //return $resource('/sequenceItems', {}, {
            //    query: {method:'GET', params:{}, isArray:true}
            //});
        })
        .factory('GameConf', ['$resource', function ($resource) {
            return $resource('/gameConf/:id', null, {
                'update': {
                    method: 'PUT',
                    interceptor: {
                        responseError: function (data) {
                            return "ERROR";
                        }
                    }
                },
                'getRun': {method: 'GET', url: '/gameConf/run'}
            });
        }]);

})();
