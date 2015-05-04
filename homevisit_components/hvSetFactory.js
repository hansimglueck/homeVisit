(function() {
    'use strict';

    angular.module('hvSetFactory', ['ngResource']).factory('setFactory', ['$resource', '$rootScope', function ($resource, $rootScope) {
        var Resource = $resource('/decks/:id', null, {
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
        restfactory.decks = Resource.query(null, function (data) {
            //console.log("setfactory.query: " + data);
            //console.log(data);
            data.forEach(function (deck) {
                deck.items.forEach(function (item) {
                    if (typeof item === 'undefined' || item === null) {
                        return;
                    }
                    if (typeof item.device === "undefined") {
                        item.device = ["default"];
                    }
                    if (typeof item.device === "string") {
                        item.device = [item.device];
                    }
                    item.collapsed = true;
                });
            });
            $rootScope.$broadcast("decksLoaded");
        });

        restfactory.getDeckById = function(deckId) {
            var decks = restfactory.decks.filter(function(deck) {
                return deck._id === deckId;
            });
            var deck = null;
            if (decks.length > 0) {
                deck = decks[0];
            }
            return deck;
        };
        restfactory.addDeck = function (newDeck, callback) {
            var deck = new Resource(newDeck);
            deck.$save(callback);
        };

        restfactory.duplicateDeck = function (deckId) {

        };

        restfactory.updateDeck = function (updatedDeck) {
            var id = updatedDeck._id;
            delete updatedDeck._id;   //sonst macht mongoDB auf dem raspi stunk
            console.log(updatedDeck);
            return Resource.update({id: id}, updatedDeck, function (err) {
                if (err) {
                }
            }).$promise;
        };

        restfactory.deleteDeck = function (index) {
            var deck = restfactory.decks[index];
            Resource.delete({id: deck._id}, function () {
                restfactory.decks.splice(index, 1);
            });
        };
        return restfactory;
    }]);

})();
