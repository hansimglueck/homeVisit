angular.module("playerControllers", [])
    .controller('ctrl', function ($scope, Socket, $cookies, colors, itemTypes, playerColors) {
        $scope.debug = false;
        $scope.cookie = $cookies['connect.sid'];
        $scope.messages = ["waiting..."];
        $scope.text = [".oO"];
        $scope.options = null;
        $scope.limit = 1;
        $scope.checked = 0;
        $scope.player = {};
        $scope.type = "rating";
        $scope.itemTypes = itemTypes;
        $scope.votelast = "vote";

        $scope.checkChanged = function (option) {
            if (option.checked) $scope.checked++;
            else $scope.checked--;
        };

        $scope.toVote = function () {
            $scope.type = $scope.votelast;
        }


    })
    .controller('HomeController', function ($scope, $location, Status, Home, Socket) {
        $scope.status = Status;
        $scope.home = Home;
        $scope.text = $scope.home.text;
        $scope.type = $scope.home.type;
        //Socket.on('display', function (event) {
        //    var data = JSON.parse(event.data).data;
        //    console.log("new display: " + data.type);
        //    $location.path('/home');
        //    if (!!data.text) $scope.text = data.text.split("::");
        //    $scope.type = "card";
        //    $scope.labels = [];
        //    $scope.data = [];
        //    if (data.type == "vote") {
        //        $scope.type = "vote";
        //        $scope.options = data.voteOptions;
        //        $scope.limit = data.voteMulti;
        //        $scope.checked = 0;
        //        $scope.votelast = "vote";
        //
        //    }
        //    else $scope.options = null;
        //    if (data.type == "result") {
        //        $scope.type = "result";
        //        //$scope.text = "";
        //        $scope.labels = data.labels;
        //        $scope.data = data.data;
        //        $scope.votelast = "result";
        //    }
        //    if (data.type == "rating") {
        //        $scope.type = 'rating';
        //        if (data.text == "start") {
        //            $scope.ratingActive = true;
        //        }
        //        if (data.text == "stop") {
        //            $scope.ratingActive = false;
        //        }
        //    }
        //
        //})
        $scope.vote = function (id) {
            console.log(id);
            if (id != undefined) {
                console.log("no");
                $scope.home.options[id].checked = true;
            }
            Socket.emit({type: "vote", data: $scope.home.options, playerId: $scope.status.player.playerId});
        };
    })
    .controller('MenuController', function ($scope, Status, Socket) {
        $scope.status = Status;
        $scope.socket = Socket;
        $scope.pingpong = Socket.getPingPong();
        $scope.joinGame = function () {
            Status.joinGame();
        };
        $scope.leaveGame = function () {
            Status.leaveGame();
        };
        $scope.reload = function() {
            window.location.reload();console.log('X')

        };
        $scope.$on("pingpong", function(event, pingTime, pingCount, pingTimeouts) {
            //console.log(pingTime, pingCount);
            $scope.pingTime = pingTime;
            $scope.pingCount = pingCount;
            $scope.pingTimeouts = pingTimeouts;
            $scope.$digest();
        })
    })

    .controller('NavbarController', function ($scope, $location, Status, colors) {
        $scope.status = Status;
        $scope.col1 = function () {
            return colors[$scope.status.player.colors[0]];
        };
        $scope.col2 = function () {
            return colors[$scope.status.player.colors[1]];
        };
        $scope.$on("disconnected", function () {
            $scope.status.resetPlayer();
        });
        $scope.go = function (path) {
            $location.path(path);
        };

    })

    .controller('VoteController', function ($scope, Socket, colors, playerColors) {

    })
    .controller('ChatController', function ($scope, Status, Chat, colors, playerColors) {
        $scope.messages = Chat.messages;
        $scope.status = Status;
        $scope.colors = colors;
        $scope.playerColors = playerColors;
        $scope.data = {};
        $scope.data.newMessage = "";
        $scope.isOtherPlayer = function (player) {
            //console.log(player);
            if (!player.joined) return false;
            if (player.playerId == $scope.status.player.playerId) return false;
            return true;
        };
        $scope.chat = function(pid) {
            Chat.chat(pid, $scope.data.newMessage[pid]);
            $scope.data.newMessage[pid] = "";
        }

    })
    .controller('RatingController', function ($scope, Status, Rating, colors, playerColors) {
        $scope.status = Status;
        $scope.rating = Rating;
        $scope.colors = colors;
        $scope.myRatings = Rating.myRatings;
        $scope.avgRatings = $scope.rating.avgRatings;
        $scope.playerColors = playerColors;
        $scope.moodys = ["C", "CC", "CCC", "B", "BB", "BBB", "A", "AA", "AAA"];
        $scope.isOtherPlayer = function (player) {
            //console.log(player);
            if (!player.joined) return false;
            if (player.playerId == $scope.status.player.playerId) return false;
            return true;
        };
        $scope.rate = function (id, val) {
            $scope.rating.rate(id, val);
        };
        $scope.$watch(
            function (scope) {
                return scope.status.maxPlayers
            },
            function () {
                console.log("fill");
                $scope.rating.fillMyRatings();
            });
        $scope.$watch(
            function (scope) {
                return scope.status.joined
            },
            function (newVal) {
                console.log("x");
                console.log($scope.status.rating);
                $scope.rating.setMyRatings($scope.status.rating);
                if (newVal) $scope.rating.rate(0, 0);
            });

    });

