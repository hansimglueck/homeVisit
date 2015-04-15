'use strict';

angular.module('homeVisitMCApp')
    .controller('DummiesCtrl', function ($scope) {
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
        $scope.polls = [
            {
                question: "Ist es toll hier?",
                type: 'binary',
                answers: new Array(14)
            },
            {
                question: "Wie toll denn?",
                type: 'fingers',
                answers: new Array(14)
            },
            {
                question: "Wie gerne magst Du Eis?",
                type: 'fingers',
                answers: new Array(14)
            },
            {
                question: "Wie charmant bist Du?",
                type: 'fingers',
                answers: new Array(14)
            },
            {
                question: "Hast Du Nachts Angst?",
                type: 'binary',
                answers: new Array(14)
            },
            {
                question: "Willst Du weiter spielen?",
                type: 'binary',
                answers: new Array(14)
            },
            {
                question: "Wie stark bist Du?",
                type: 'fingers',
                answers: new Array(14)
            }
        ];
        $scope.selectRow = function(id){
            $scope.selectedRow = id;
        };
        $scope.selectAnswer = function(did, aid) {
            $scope.polls[$scope.selectedRow].answers[did] = aid;
        };
        $scope.showPlusMinus = function(x) {
            if (x === 0) return "-";
            if (x === 1) return "+";
        };
        $scope.unanswered = function(did){
            return typeof $scope.polls[$scope.selectedRow].answers[did] == 'undefined';
        }
    });
