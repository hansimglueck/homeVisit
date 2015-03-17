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
    .value('itemTypes', [
        {value: 'card', text: 'Karte'},
        {value: 'sound', text: 'Sound'},
        {value: 'vote', text: 'Abstimmung'},
        {value: 'results', text: 'Results'},
        {value: 'switch', text: 'Switch'},
        {value: 'cmd', text: 'Kommando'}
    ]
)
    .value('resultTypes', [
        {value: 'Pie', text: 'Tortendiagramm'},
        {value: 'Bar', text: 'Balkendiagramm'},
        {value: 'Line', text: 'Kurve'},
        {value: 'seatOrder', text: 'Sitzordnung'}
    ])
    .value('voteTypes', [
        {value: 'customOptions', text: 'eine der Optionen hier'},
        {value: 'customMultipleOptions', text: 'mehrere der Optionen hier'},
        {value: 'playerChoice', text: 'Spielerwahl'},
        {value: 'countryChoice', text: 'Länderwahl'}
    ])
    .value('languages', [
        {value: 'de', text: 'Deutsch'},
        {value: 'en', text: 'Englisch'}
    ])
    .factory('gameConf', ['$resource', function ($resource) {
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
    }])
    .factory('setFactory', ['$resource', '$rootScope', function ($resource, $rootScope) {
        var resource = $resource('/decks/:id', null, {
            'update': {
                method: 'PUT',
                interceptor: {
                    responseError: function (data) {
                        console.log("error");
                        console.log(data);
                        return "ERROR";
                    }
                }
            }
        });
        var restfactory = {};
        restfactory.decks = resource.query(null, function (data) {
            console.log("setfactory.query: "+data);
            console.log(data);
            data.forEach(function(deck){
                deck.items.forEach(function(item) {
                    if (typeof item.device == "undefined") item.device = "default";
                })
            });
            $rootScope.$broadcast("decksLoaded")
        });

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