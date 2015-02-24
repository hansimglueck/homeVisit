angular.module("playerControllers", [])
    .controller('ctrl', function ($scope, Socket, $cookies, colors, itemTypes, playerColors) {
        $scope.debug = false;
        $scope.cookie = $cookies['connect.sid'];
        $scope.messages = ["waiting..."];
        $scope.status = {
            connected: Socket.connected,
            game: {joined: false, player: null},
        };
        $scope.text = [".oO"];
        $scope.options = null;
        $scope.limit = 1;
        $scope.checked = 0;
        $scope.player = {};
        $scope.col1 = {};
        $scope.col2 = {};
        $scope.colors = colors;
        $scope.type = "rating";
        $scope.itemTypes = itemTypes;
        $scope.ratingActive = true;
        $scope.avgRatings = [];
        $scope.playerColors = playerColors;
        $scope.myRatings = [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4];
        $scope.moodys = ["C", "CC", "CCC", "B", "BB", "BBB", "A", "AA", "AAA"];
        $scope.votelast = "vote";
        Socket.on('registerConfirm', function () {
            $scope.status.connected = true;
            Socket.emit({type: "rate", data: {rate: $scope.myRatings, playerId: $scope.player.playerId}});
        });
        $scope.vote = function (id) {
            console.log(id);
            if (id != undefined) {
                console.log("no");
                $scope.options[id].checked = true;
            }
            Socket.emit({type: "vote", data: $scope.options, playerId: $scope.player.playerId});
        };

        $scope.checkChanged = function (option) {
            if (option.checked) $scope.checked++;
            else $scope.checked--;
        };

        //Socket.on('registerConfirm', function (event) {
        //    $scope.player = JSON.parse(event.data).data;
        //    $scope.col1 = $scope.colors[$scope.player.colors[0]];
        //    //           $scope.col1.height = "50px";
        //    $scope.col2 = $scope.colors[$scope.player.colors[1]];
        //    //         $scope.col2.height = "50px";
        //});
        //
        //Socket.on('display', function (event) {
        //    var data = JSON.parse(event.data).data;
        //    console.log("new display: " + data.type);
        //    if (data) {
        //        if (!!data.text) $scope.text = data.text.split("::");
        //        $scope.type = "card";
        //        $scope.labels = [];
        //        $scope.data = [];
        //        if (data.type == "vote") {
        //            $scope.type = "vote";
        //            $scope.options = data.voteOptions;
        //            $scope.limit = data.voteMulti;
        //            $scope.checked = 0;
        //            $scope.votelast = "vote";
        //
        //        }
        //        else $scope.options = null;
        //        if (data.type == "result") {
        //            $scope.type = "result";
        //            $scope.text = "";
        //            $scope.labels = data.labels;
        //            $scope.data = data.data;
        //            $scope.votelast = "result";
        //        }
        //        if (data.type == "rating") {
        //            $scope.type = 'rating';
        //            if (data.text == "start") {
        //                $scope.ratingActive = true;
        //            }
        //            if (data.text == "stop") {
        //                $scope.ratingActive = false;
        //            }
        //        }
        //
        //    }
        //});
        $scope.toVote = function () {
            $scope.type = $scope.votelast;
        }


    })
    .controller('MenuController', function ($scope, Status, colors, playerColors) {
        $scope.status = Status;
        $scope.joinGame = function() {
            Status.joinGame();
        };
        $scope.leaveGame = function() {
            Status.leaveGame();
        }
    })

    .controller('NavbarController', function ($scope, Status, colors) {
        $scope.status = Status;
        $scope.col1 = function() { return colors[$scope.status.player.colors[0]]; };
        $scope.col2 = function() { return colors[$scope.status.player.colors[1]]; };

    })

    .controller('VoteController', function ($scope, Socket, colors, playerColors) {

    })
    .controller('ChatController', function ($scope, Socket, colors, playerColors) {

    })
    .controller('RatingController', function ($scope, Socket, colors, playerColors) {
        $scope.colors = colors;
        $scope.playerColors = playerColors;
        $scope.myRatings = [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4];
        $scope.moodys = ["C", "CC", "CCC", "B", "BB", "BBB", "A", "AA", "AAA"];
        $scope.rate = function (id, val) {
            $scope.myRatings[id] += val;
        };
        //Socket.on('registerConfirm', function () {
        //    Socket.emit({type: "rate", data: {rate: $scope.myRatings, playerId: $scope.player.playerId}});
        //});

    })

