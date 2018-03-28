(function () {
    'use strict';

    angular.module('homeVisitMCApp')
        .controller('NotesController', function ($scope, Deck, gettextCatalog, close, $element, Status, $sce) {
            $scope.deck = Deck;
            $scope.thisCanBeusedInsideNgBindHtml = $sce.trustAsHtml($scope.deck.mcNote);
            $scope.lang = gettextCatalog.currentLanguage;
            $scope.status = Status;
            $scope.closeModal = function () {
                if (Deck.mcTasks.select) {
                    if (Status.otherPlayers.filter(function (player) {
                            return player.selected;
                        }).length === 0) {
                        $scope.message = "Select someone!";
                        return;
                    }
                }
                $element.modal('hide');

                //  Now close as normal, but give 500ms for bootstrap to animate
                close(null, 500);
            };
            $scope.toggleSelected = function (id) {
                console.log("select player " + id);
                Socket.emit("setPlayerStatus", {cmd: "toggleSelected", id: id});
            };
            $scope.playerSelected = function (id) {
                if (Status.otherPlayers[id].selected) {
                    return gettextCatalog.getString('Deselect');
                } else {
                    return gettextCatalog.getString('Select');
                }
            };


        });

})();
