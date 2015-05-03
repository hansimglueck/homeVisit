(function() {
    'use strict';

    angular.module('homeVisitMCApp')
        .controller('ItemCtrl', function($scope, Deck, Playback, gettextCatalog) {
            $scope.lang = gettextCatalog.currentLanguage;
            $scope.deck = Deck;
            $scope.getIndex = function() {
                return Deck.stepIndex + $scope.indexOffset;
            };
            $scope.getItem = function() {
                return Deck.get($scope.getIndex());
            };
            $scope.isPrevious = function() {
                return $scope.getItem() === Deck.previous;
            };
            $scope.isCurrent = function() {
                return $scope.getItem() === Deck.current;
            };
            $scope.isNext = function() {
                return $scope.getItem() === Deck.next;
            };
            $scope.playback = Playback.playback;
            $scope.alert = Playback.alert;
            $scope.skipStep = function() {
                return Deck.stepIndex + $scope.getFollowItems().length + 1;
            };
            // follow items
            $scope.getFollowItems = function(item) {
                var indexCounter = Deck.stepIndex + 2, followItems = [];
                if (indexCounter < Deck.deck.items.length) {
                    while (true) {
                        var afterNext = Deck.deck.items[indexCounter];
                        if (indexCounter >= Deck.deck.items.length || afterNext.trigger !== 'follow') {
                            break;
                        }
                        followItems.push(afterNext);
                        indexCounter++;
                    }
                }
                return followItems;
            };
        });

})();
