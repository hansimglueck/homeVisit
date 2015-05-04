(function() {
    'use strict';

    angular.module("fxControllers", [])
        .controller('overlayController', function($scope, Status, Socket, fxService){
            $scope.fx = fxService;
            $scope.status = Status;
            $scope.posAlerts = fxService.posAlerts;
            $scope.alerts = fxService.alerts;
            $scope.classes = {};
            $scope.$watch('status.player.score', function(newVal,oldVal){
                console.log("Player"+$scope.status.player.playerId+"-Score: "+oldVal+"->"+newVal);
                var score = newVal-oldVal;
                $scope.scoreAlert(score);
            });
            $scope.scoreAlert = function(score){
                fxService.scoreAlert(score);
            };
        });

})();
