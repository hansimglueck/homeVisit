(function() {
    'use strict';

    angular.module("dealControllers", [])
        .controller('ChooseDealPlayerController', function ($scope, Status, DealFactory, $location) {
            $scope.dealFactory = DealFactory;
            $scope.players = Status.getAvailablePlayers();
            $scope.status = Status;
            $scope.denyDealing = function() {
                DealFactory.denyDealing();
                $location.path("/deal/noDealing");
            }
        })
        .controller('DealDetailsController', function ($scope, DealFactory, $routeParams, $location, Status) {
            $scope.playerId = $routeParams.playerId || null;
            $scope.status = Status;
            $scope.requestDeal = function () {
                DealFactory.requestDeal($scope.playerId);
                $location.path("/deal/messageSent/"+$scope.playerId);
            };
            $scope.confirm = function() {
                DealFactory.confirm();
                $location.path("/deal/messageSent/"+$scope.playerId);
            };
            $scope.deny = function() {
                DealFactory.deny();
                $location.path("/deal/messageSent/"+$scope.playerId);
            };
        })
;

})();
