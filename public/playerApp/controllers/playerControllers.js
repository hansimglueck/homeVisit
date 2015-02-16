angular.module("playerControllers", [])
    .controller('ctrl', function ($scope, Socket, $cookies, colors, itemTypes) {
        $scope.debug = false;
        $scope.cookie = $cookies['connect.sid'];
        $scope.messages = ["waiting..."];
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
        $scope.ratingActive = false;
        $scope.$on('$viewContentLoaded', function(){
            console.log("$viewContentLoaded");
            //$scope.register();
        });
        $scope.register = function() {
            //register
            //Socket.emit({type: "register", data: {role:'player', sid:$scope.cookie}});
            //Socket.connect();
        };
        $scope.vote = function (id) {
            console.log(id);
            if (id != undefined) {
                console.log("no");
                $scope.options[id].checked = true;
            }
            Socket.emit({type: "vote", data: $scope.options});
        };

        $scope.checkChanged = function (option) {
            if (option.checked) $scope.checked++;
            else $scope.checked--;
        };

        Socket.on('registerConfirm', function(event) {
            $scope.player = JSON.parse(event.data).data;
            $scope.col1 = $scope.colors[$scope.player.colors[0]];
 //           $scope.col1.height = "50px";
            $scope.col2 = $scope.colors[$scope.player.colors[1]];
   //         $scope.col2.height = "50px";
        });

        Socket.on('display', function (event) {
            var data = JSON.parse(event.data).data;
            console.log("new display: " + data.type);
            if (data) {
                if (!!data.text) $scope.text = data.text.split("::");
                $scope.type = "card";
                $scope.labels = [];
                $scope.data = [];
                if (data.type == "vote") {
                    $scope.type = "vote";
                    $scope.options = data.voteOptions;
                    $scope.limit = data.voteMulti;
                    $scope.checked = 0;
                }
                else $scope.options = null;
                if (data.type == "result") {
                    $scope.type = "result";
                    $scope.text = "";
                    $scope.labels = data.labels;
                    $scope.data = data.data;
                }
                if (data.type = "rating") {
                    $scope.type = 'rating';
                    if (data.text == "start") {
                        $scope.ratingActive = true;
                    }
                    if (data.text == "stop") {
                        $scope.ratingActive = false;
                    }
                }

            }
        });


    }).
    controller('RatingController', function($scope, Socket, colors, playerColors) {
        $scope.colors = colors;
        $scope.playerColors = playerColors;
        $scope.myRatings = [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4];
        $scope.moodys = ["C","CC","CCC","B","BB","BBB","A","AA","AAA"];
        $scope.rate = function(id,val) {
            $scope.myRatings[id] += val;
            Socket.emit({type: "rate", data: {rate: $scope.myRatings, playerId: $scope.player.playerId}});
        };

        Socket.on('rates', function(event) {
            var data = JSON.parse(event.data).data;
            $scope.avgRatings = data.avgRating;
            console.log($scope.avgRatings);
        })


    })
;
