(function () {
    'use strict';

    angular.module('homeVisitMCApp')
        .controller('ScriptCtrl', function ($scope, $timeout, Deck, Playback, gettextCatalog, $anchorScroll, $location, ScriptScroll, Status, playerColors, ModalService,TeamActionInfo) {
            $scope.playerColors = playerColors;
            $scope.playerPos = [
                {top: 8, left: 15},
                {top: 8, left: 265},
                {top: 8, left: 515},
                {top: 8, left: 765},
                {top: 108, left: 765},
                {top: 108, left: 515},
                {top: 108, left: 265},
                {top: 108, left: 15}
            ];
            $scope.status = Status;
            $scope.lang = gettextCatalog.currentLanguage;
            $scope.deck = Deck;
            $scope.goList = Deck.goList;
            $scope.playback = function(cmd, param) {
                if (cmd === "go" && !Deck.mcTasks.go) {
                    console.log("TOO MUCH GO CLICKED!!!");
                    return;
                }
                Playback.playback(cmd, param);
            };
            $scope.alert = Playback.alert;
            $scope.skipStep = function () {
                return Deck.stepIndex + $scope.getFollowItems().length + 1;
            };
            $scope.scrollToAct = ScriptScroll.scrollToAct;
            ScriptScroll.scrollToAct();
            $scope.playerDetails = function (playerId) {
                if (Status.otherPlayers[playerId].joined) {
                    playerPopUp(playerId);
                }
            };
            $scope.showInfoOfTeam = function (playerId) {
                return TeamActionInfo.actionInfo[playerId];
            };
            function playerPopUp(playerId) {
                ModalService.showModal({
                    templateUrl: "views/player.modal.html",
                    controller: "PlayerModalCtrl",
                    inputs: {
                        playerId: playerId
                    }
                }).then(function (modal) {
                    // The modal object has the element built, if this is a bootstrap modal
                    // you can call 'modal' to show it, if it's a custom modal just show or hide
                    // it as you need to.
                    modal.element.modal({
                        backdrop: 'static'
                    });
                });
            }
        })
        .controller("PlayerModalCtrl", function ($scope, Socket, playerColors, close, $element, Status, playerId, gettextCatalog) {

            $scope.socket = Socket;
            $scope.playerColors = playerColors;
            $scope.playerId = playerId;

            $scope.score = function (id, val) {
                console.log("score " + val);
                //Socket.emit("setPlayerStatus", {cmd: "score", id: id, value: val});
                Socket.emit("score", {playerId: id, score: val, reason: 'mc'});
                $scope.closeModal();
            };

            $scope.throwOut = function (playerId) {
                if (!confirm("really throw out of the game?")) return;
                Socket.emit("setPlayerStatus", {cmd: "throwOut", id: playerId});
                $scope.closeModal();
            };
            $scope.closeModal = function () {
                $element.modal('hide');
                //  Now close as normal, but give 500ms for bootstrap to animate
                close(null, 500);
            };
            $scope.toggleSelected = function (id) {
                console.log("select player " + id);
                Socket.emit("setPlayerStatus", {cmd: "toggleSelected", id: id});
                $scope.closeModal();
            };
            $scope.playerSelected = function () {
                if (Status.otherPlayers[$scope.playerId].selected) {
                    return gettextCatalog.getString('Deselect');
                } else {
                    return gettextCatalog.getString('Select');
                }
            };

        })

})();
