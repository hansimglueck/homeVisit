(function () {
    'use strict';

    angular.module('homeVisitMCApp')
        .controller("ResultsController", function ($scope, Socket, Display) {

            $scope.socket = Socket;
            $scope.display = Display;
            $scope.pieChartOptions = {
                scaleOverlay: false,
                scaleOverride: false,
                scaleSteps: null,
                scaleStepWidth: null,
                scaleStartValue: null,
                scaleLineColor: "rgba(0,0,0,.1)",
                scaleLineWidth: 1,
                scaleShowLabels: true,
                scaleLabel: "<%=value%>",
                scaleFontFamily: "'proxima-nova'",
                scaleFontSize: 10,
                scaleFontStyle: "normal",
                scaleFontColor: "#909090",
                scaleShowGridLines: true,
                scaleGridLineColor: "rgba(0,0,0,.05)",
                scaleGridLineWidth: 1,
                bezierCurve: true,
                pointDot: true,
                pointDotRadius: 3,
                pointDotStrokeWidth: 1,
                datasetStroke: true,
                datasetStrokeWidth: 2,
                datasetFill: true,
                animation: true,
                animationSteps: 1,
                //animationEasing: "easeOutQuart",
                onAnimationComplete: null,
                responsive: true
            };

        })
        .controller("VoteController", function($scope, Display, close, $element) {
            $scope.display = Display;
            $scope.state = "vote";
            $scope.enteredText = { value: "" };
            $scope.checkChanged = function (option) {
                if (option.checked) {
                    $scope.display.checked++;
                }
                else {
                    $scope.display.checked--;
                }
                console.log("now " + $scope.display.checked + " checked. display.limit=" + $scope.display.limit);
            };
            $scope.vote = function (id) {
                //bei multiple-choice werden die checked direkt in der homeFactory gesetzt... und die funktion hier wird ohne argument aufgerufen
                if (typeof id !== 'undefined') {
                    $scope.display.options[id].checked = true;
                    if ($scope.display.voteType === "enterNumber" || $scope.display.voteType === "enterText") {
                        $scope.display.options[id].text = $scope.display.options[id].value;
                    }
                }
                Display.vote();
                $scope.state = "confirm";
            };
            $scope.confirmVote = function () {
                Display.confirmVote();
                $scope.closeModal();
            };
            $scope.cancelVote = function () {
                $scope.display.options.forEach(function (opt) {
                    opt.checked = false;
                });
                $scope.display.checked = 0;
                $scope.state = "vote";
            };
            $scope.closeModal = function () {
                $element.modal('hide');
                //  Now close as normal, but give 500ms for bootstrap to animate
                close(null, 500);
            };
            $scope.submitNumber = function (v) {
                $scope.display.options[0].value = v;
                $scope.vote(0);
            };

            $scope.submitText = function () {
                $scope.display.options[0].value = $scope.enteredText.value;
                $scope.vote(0);
            };

            $scope.smaller = false;
            if ($scope.display.voteType === 'customOptions') {
                var totalLength = 0;
                if (typeof Display.text !== "undefined") {
                    totalLength += Display.text.length;
                }
                Display.options.forEach(function(o) {
                    totalLength += o.text.length;
                });
                if (totalLength > 400) {
                    console.log('lot of text: making it smaller!');
                    console.log('totalLength', totalLength);
                    $scope.smaller = true;
                }
            }

        })

})();
