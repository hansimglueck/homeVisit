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
        $scope.playerIds = $routeParams.playerId.split(":");
    })
    .controller('RatingController', function ($scope, Socket, Status, Rating, $routeParams, $location) {
        $scope.status = Status;
        $scope.rating = Rating;
        $scope.score = $routeParams.score;
        $scope.playerIds = [];
        if ($routeParams.playerId) $scope.playerIds = $routeParams.playerId.split(":");
        $scope.traitor = false;
        $scope.playerIds.forEach(function (pid) {
            console.log(Status.getAllied());
            console.log(pid);
            console.log(Status.getAllied().indexOf(pid));
            console.log(Status.getAllied().indexOf(parseInt(pid)));
            if (Status.getAllied().indexOf(parseInt(pid)) != -1) $scope.traitor = true;
        });
        $scope.confirm = function () {
            $scope.playerIds.forEach(function (playerId) {
                Socket.emit("score", {playerId: playerId, score: $scope.score, reason: 'Player'});
            });
            $location.path("/rating/done");
        };

        $scope.cancel = function () {
            window.history.back();//$location.path(Rating.path);
        }
    });
