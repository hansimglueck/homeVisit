/**
 * Created by jeanbluer on 16.01.15.
 */

var gameServices = angular.module('gameServices', ['ngResource']);

gameServices.factory('Game', ['$resource', function($resource){
    return $resource('/decks/:id', null, {
        'update': { method:'PUT' }    });
    //return $resource('/sequenceItems', {}, {
    //    query: {method:'GET', params:{}, isArray:true}
    //});
}])
    .factory('itemTypes', function() {
    return [
        { value: 'card', text: 'Karte' },
        { value: 'sound', text: 'Sound' },
        { value: 'vote', text: 'Abstimmung'},
        { value: 'switch', text: 'Switch'},
        { value: 'rating', text: 'Rating'}
    ]
})
    .factory('gameConf', ['$resource', function($resource) {
        return $resource('/gameConf/:id', null, {
            'update': { method:'PUT' },
            'getRun': { method:'GET', url:'/gameConf/run' }
        });
    }])
    .factory('setFactory', ['$resource', function($resource){
        var resource = $resource('/decks/:id', null, {
            'update': { method:'PUT' }    });
        var restfactory = {};
        restfactory.decks = resource.query();

        restfactory.addDeck = function(newDeck, callback){
            var deck = new resource(newDeck);
            deck.$save(callback);
        };

        restfactory.duplicateDeck =function(deckId) {

        };

        restfactory.updateDeck = function(deckId, updatedDeck) {
            delete updatedDeck._id;   //sonst macht mongoDB auf dem raspi stunk
            console.log(updatedDeck);
            resource.update({id: restfactory.decks[deckId]._id}, updatedDeck, function (err) {
                if (err) {
                }
            });

        };

        restfactory.deleteDeck = function(index) {
            var deck = restfactory.decks[index];
            resource.delete({id: deck._id}, function () {
                restfactory.decks.splice(index, 1);
            });

        };
        return restfactory;
     }])
;