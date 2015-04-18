'use strict';

angular.module('homeVisitMCApp')
    .controller('DummiesCtrl', function ($scope, Polls) {
        $scope.selectedRow = 3;
        $scope.dummies = [
            {name: 'dummy1', top: 10, left: 189},
            {name: 'dummy2', top: 10, left: 377},
            {name: 'dummy3', top: 10, left: 565},
            {name: 'dummy4', top: 10, left: 753},
            {name: 'dummy5', top: 10, left: 941},
            {name: 'dummy6', top: 150, left: 1110},
            {name: 'dummy7', top: 340, left: 1110},
            {name: 'dummy8', top: 490, left: 941},
            {name: 'dummy9', top: 490, left: 753},
            {name: 'dummy10', top: 490, left: 565},
            {name: 'dummy11', top: 490, left: 377},
            {name: 'dummy12', top: 490, left: 189},
            {name: 'dummy13', top: 340, left: 20},
            {name: 'dummy14', top: 150, left: 20}
        ];
        $scope.polls = Polls;
        $scope.selectRow = function(id){
            $scope.selectedRow = id;
        };
        $scope.selectAnswer = function(did, aid) {
            $scope.polls.polls[$scope.selectedRow].answers[did] = aid;
        };
        $scope.showPlusMinus = function(x) {
            if (x === 0) return "-";
            if (x === 1) return "+";
        };
        $scope.unanswered = function(did){
            return typeof $scope.polls.polls[$scope.selectedRow].answers[did] == 'undefined';
        }
    });
