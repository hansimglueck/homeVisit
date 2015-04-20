angular.module('homeVisitMCApp')
    .controller('DeckCtrl', function($scope, Deck, itemOptions, $filter){
        $scope.deck = Deck;
        //$scope.nextDeckItem = Deck.deck.items[Deck.stepIndex + 1];
        
        $scope.showTextForValue = function (item, option) {
            var selected = [];
            if (item[option]) {
                selected = $filter('filter')(itemOptions[option], {value: item[option]}, true);
            }
            return selected.length ? selected[0].text : 'Not set';
        };
    })
;
