(function () {
    'use strict';

    angular.module('homeVisitMCApp')
        .controller('PollPopupController', function ($scope, PlayerNames, Polls, gettextCatalog, $element, Status, startId, selectAnswer, isInGame, close) {
            $scope.polls = Polls;
            $scope.selectedRow = Polls.selectedPoll;
            $scope.gettextCatalog = gettextCatalog;
            $scope.lang = gettextCatalog.currentLanguage;
            $scope.playerNames = PlayerNames;
            $scope.status = Status;
            $scope.did = startId;
            $scope.selectAnswer = function(did, aid) {
                selectAnswer(did,aid);
                $scope.changeDummy(1);
            };

            $scope.changeDummy = function(diff) {
                $scope.did += diff + 15;
                $scope.did %= 15;

                //TODO: prevent from recursion, if there is no inGame-dummy
                if (!isInGame($scope.did)) {
                    $scope.changeDummy(diff);
                }

            };
            $scope.closeModal = function () {
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
