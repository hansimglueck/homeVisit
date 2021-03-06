(function() {
    'use strict';

    angular.module("ratingControllers", [])
        .controller('RatePlayerController', function ($scope, Status, Rating, $routeParams, Home) {
            $scope.status = Status;
            $scope.rating = Rating;
            $scope.home = Home;
            $scope.score = $routeParams.score;
        })
        .controller('RateScoreController', function ($scope, Status, Rating, $routeParams, Home) {
            $scope.status = Status;
            $scope.rating = Rating;
            $scope.home = Home;
            $scope.playerId = $routeParams.playerId;
            if ($scope.playerId) {
                $scope.playerIds = $routeParams.playerId.split(":");
            } else {
                $scope.playerIds = [];
            }
            $scope.playerIds.forEach(function(i) {
                if (parseInt(i) === Status.player.playerId) {
                    Home.doneTask();
                }
            });
            $scope.notBeingRatedMyself = function() {
                for (var i = 0; i < $scope.playerIds.length; i++) {
                    if (parseInt($scope.playerIds[i]) === Status.player.playerId) {
                        return false;
                    }
                }
                return true;
            };
        })
        .controller('RatingController', function ($scope, Socket, Status, Rating, Home, $routeParams, $location) {
            $scope.status = Status;
            $scope.rating = Rating;
            $scope.score = $routeParams.score;
            $scope.home = Home;
            $scope.playerIds = [];
            if ($routeParams.playerId) {
                $scope.playerIds = $routeParams.playerId.split(":");
            }
            $scope.traitor = false;
            $scope.playerIds.forEach(function (pid) {
                if ($scope.score < 0 && Status.getAllied().indexOf(parseInt(pid)) !== -1) {
                    $scope.traitor = true;
                }
            });
            $scope.confirm = function () {
                Home.doneTask();
                $scope.playerIds.forEach(function (playerId) {
                    Socket.emit("rate", {player1Id: playerId, score: $scope.score, reason: "rating", player0Id:Status.player.playerId, pollId:Home.pollId});
                });

                $location.path("/rating/done");
            };

            $scope.cancel = function () {
                window.history.back();//$location.path(Rating.path);
            };
        });

})();
