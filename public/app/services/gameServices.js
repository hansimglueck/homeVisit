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
    .value('itemOptions', {
        'type': [
            {value: 'card', text: 'Karte', mappable: true},
            {value: 'sound', text: 'Sound', mappable: true},
            {value: 'vote', text: 'Abstimmung', mappable: true},
            {value: 'results', text: 'Results', mappable: true},
            {value: 'deal', text: 'Deal', mappable: true},
            {value: 'switch', text: 'Switch', mappable: false},
            {value: 'inlineSwitch', text: 'Inline Switch', mappable: false},
            {value: 'cmd', text: 'Kommando', mappable: true},
            {value: 'config', text: 'Konfiguartion', mappable: false},
            {value: 'eval', text: 'eval', mappable: true},
            {value: 'dummy', text: 'Dummy', mappable: false}
        ],
        'color': [
            {value: '0', text: 'Rot'},
            {value: '1', text: 'Grün'},
            {value: '2', text: 'Blau'}
        ],
        'voteType': [
            {value: 'customOptions', text: 'eine der Optionen hier'},
            {value: 'customMultipleOptions', text: 'mehrere der Optionen hier'},
            {value: 'playerChoice', text: 'Spielerwahl'},
            {value: 'countryChoice', text: 'Länderwahl'},
            {value: 'enterNumber', text: 'Zahleingabe'}
        ],
        'resultType': [
            {value: 'Pie', text: 'Tortendiagramm'},
            {value: 'Bar', text: 'Balkendiagramm'},
            {value: 'Line', text: 'Kurve'},
            {value: 'seatOrder', text: 'Sitzordnung'},
            {value: 'europeMap', text: 'Europakarte'},
            {value: 'numberStats', text: 'Numerische Auswertung'}
        ],
        'language': [
            {value: 'de', text: 'Deutsch'},
            {value: 'en', text: 'Englisch'}
        ],
        'scoreType': [
            {value: 'noScore', text: 'Kein Score'},
            {value: 'optionScore', text: 'Nach Antwort'},
            {value: 'majorityScore', text: 'Nach Mehrheit'}
        ],
        'sourceType': [
            {value: 'previousStep', text: 'Vorhergehender Step'},
            {value: 'positivePlayerScore', text: 'Scores grösser Null'}
        ],
        trigger: [{text: "Go", value: "go"}, {text: "Follow", value: "follow"}],
        configField: [
            {value: 'alertRecipients', text: 'alertRecipients'}
        ],
        tradeType: [
            {text: "partner", value: "Partner"}
        ]
    })
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
            console.log("setfactory.query: " + data);
            console.log(data);
            data.forEach(function (deck) {
                deck.items.forEach(function (item) {
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

        restfactory.updateDeck = function (updatedDeck) {
            var id = updatedDeck._id;
            delete updatedDeck._id;   //sonst macht mongoDB auf dem raspi stunk
            console.log(updatedDeck);
            return resource.update({id: id}, updatedDeck, function (err) {
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
