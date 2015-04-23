'use strict';

angular.module('homeVisitMCApp')
    .controller('DummiesCtrl', function ($scope, Polls, PlayerNames, gettext) {
        $scope.selectedRow = 0;
        $scope.playerNames = PlayerNames.names;
        $scope.dummies = [
            {top: 10, left: 189},
            {top: 10, left: 377},
            {top: 10, left: 565},
            {top: 10, left: 753},
            {top: 10, left: 941},
            {top: 60, left: 1110},
            {top: 250, left: 1110},
            {top: 440, left: 1110},
            {top: 490, left: 941},
            {top: 490, left: 753},
            {top: 490, left: 565},
            {top: 490, left: 377},
            {top: 490, left: 189},
            {top: 340, left: 20},
            {top: 150, left: 20}
        ];
        $scope.polls = Polls;
        $scope.selectRow = function(id){
            $scope.selectedRow = id;
        };
        $scope.selectAnswer = function(did, aid) {
            //if (Polls.)
            $scope.polls.polls[$scope.selectedRow].answers[did] = aid;
        };
        $scope.showPlusMinus = function(x) {
            if (x === 0) return "-";
            if (x === 1) return "+";
            return "";
        };
        $scope.unanswered = function(did){
            return typeof $scope.polls.polls[$scope.selectedRow].answers[did] == 'undefined';
        }
        $scope.setName = function(nr) {
            var name = prompt(gettext('Change name'), PlayerNames.names[nr]);
            if (name != null){
                PlayerNames.names[nr] = name;
            }
        }
    });
