/**
 * Created by jeanbluer on 16.01.15.
 */

var gameServices = angular.module('gameServices', ['ngResource']);

gameServices.factory('Game', ['$resource', function ($resource) {
    return $resource('/decks/:id', null, {
        'update': {method: 'PUT'}
    });
    //return $resource('/sequenceItems', {}, {
    //    query: {method:'GET', params:{}, isArray:true}
    //});
}])
    .factory('itemTypes', function () {
        return [
            {value: 'card', text: 'Karte'},
            {value: 'sound', text: 'Sound'},
            {value: 'vote', text: 'Abstimmung'},
            {value: 'switch', text: 'Switch'},
            {value: 'rating', text: 'Rating'}
        ]
    })
    .factory('gameConf', ['$resource', function ($resource) {
        return $resource('/gameConf/:id', null, {
            'update': {
                method: 'PUT',
                interceptor: {
                    responseError: function(data) {
                        return "ERROR";
                    }
                }
            },
            'getRun': {method: 'GET', url: '/gameConf/run'}
        });
    }])
    .factory('setFactory', ['$resource', '$rootScope', function ($resource, $rootScope) {
        var resource = $resource('/decks/:id', null, {
            'update': {
                method: 'PUT',
                interceptor: {
                    responseError: function(data) {
                        console.log("error");
                        console.log(data);
                        return "ERROR";
                    }
                }
            }
        });
        var restfactory = {};
        restfactory.decks = resource.query(null, function(){$rootScope.$broadcast("decksLoaded")});

        restfactory.addDeck = function (newDeck, callback) {
            var deck = new resource(newDeck);
            deck.$save(callback);
        };

        restfactory.duplicateDeck = function (deckId) {

        };

        restfactory.updateDeck = function (deckId, updatedDeck) {
            delete updatedDeck._id;   //sonst macht mongoDB auf dem raspi stunk
            console.log(updatedDeck);
            return resource.update({id: restfactory.decks[deckId]._id}, updatedDeck, function (err) {
                if (err) {
                }
            }).$promise;

        };

        restfactory.deleteDeck = function (index) {
            var deck = restfactory.decks[index];
            resource.delete({id: deck._id}, function () {
                restfactory.decks.splice(index, 1);
            });

        };
        return restfactory;
    }])
;