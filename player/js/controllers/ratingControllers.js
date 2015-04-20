angular.module("ratingControllers", [])
    .controller('RatePlayerController', function ($scope, Status, Rating, $routeParams) {
        $scope.status = Status;
        $scope.rating = Rating;
        $scope.score = $routeParams.score;
    })
    .controller('RateScoreController', function ($scope, Status, Rating, $routeParams) {
        $scope.status = Status;
        $scope.rating = Rating;
        $scope.playerId = $routeParams.playerId;
    })
    .controller('RatingController', function ($scope, Socket, Status, Rating, $routeParams, $location) {
        $scope.status = Status;
        $scope.rating = Rating;
        $scope.score = $routeParams.score;
        $scope.playerId = $routeParams.playerId;
        $scope.confirm = function () {
            Socket.emit("score", {playerId: $scope.playerId, score: $scope.score, reason: 'Player'});
            $location.path("/rating/done");
        };
        $scope.cancel = function () {
            window.history.back();//$location.path(Rating.path);
        }
    });
