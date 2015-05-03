(function() {
    'use strict';

    angular.module('homeVisitMCApp')
        .controller('DeckCtrl', function($scope, Deck) {
            $scope.deck = Deck;
        });

})();
