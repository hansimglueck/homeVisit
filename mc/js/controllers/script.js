(function () {
    'use strict';

    angular.module('homeVisitMCApp')
        .controller('ScriptCtrl', function ($scope, Deck, Playback, gettextCatalog, $anchorScroll, $location, ScriptScroll) {
            $scope.lang = gettextCatalog.currentLanguage;
            $scope.deck = Deck;
            $scope.goList = Deck.goList;
            $scope.playback = Playback.playback;
            $scope.alert = Playback.alert;
            $scope.skipStep = function () {
                return Deck.stepIndex + $scope.getFollowItems().length + 1;
            };
            $scope.scrollToAct = ScriptScroll.scrollToAct;
            ScriptScroll.scrollToAct();
        });

})();
