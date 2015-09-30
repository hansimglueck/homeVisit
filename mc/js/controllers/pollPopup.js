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
            Polls.did = startId;
            $scope.selectAnswer = function(did, aid) {
                selectAnswer(did,aid);
                $scope.changeDummy(1);
            };

            $scope.changeDummy = function(diff) {
                Polls.did += diff + 15;
                Polls.did %= 15;
                //TODO: prevent from recursion, if there is no inGame-dummy
                if (!isInGame(Polls.did)) {
                    $scope.changeDummy(diff);
                }
                if (Polls.did == startId) {
                    $scope.closeModal();
                }
            };
            $scope.closeModal = function () {
                $element.modal('hide');
                Polls.did = -1;
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
