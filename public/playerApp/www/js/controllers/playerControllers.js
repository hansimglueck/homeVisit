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
    .controller('HomeController', function ($scope, $location, Status, Home, Rating, Socket, colors, playerColors) {
        $scope.colors = colors;
        $scope.playerColors = playerColors;
        $scope.status = Status;
        $scope.home = Home;
        $scope.text = $scope.home.text;
        $scope.type = $scope.home.type;
        $scope.vote = function (id) {
            console.log(id);
            if (id != undefined) {
                console.log("no");
                $scope.home.options[id].checked = true;
            }
            Socket.emit({
                type: "vote",
                data: $scope.home.options,
                playerId: $scope.status.player.playerId,
                voteId: $scope.home.voteId
            });
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
        $scope.reload = function () {
            //window.location.reload();
            console.log('X')

        };
        $scope.$on("disconnected", function () {
            console.log("MenuController got 'disconnected'");
            $scope.status.resetPlayer();
        });
        $scope.$on("pingpong", function (event, pongTime, pingTimeouts) {
            //console.log("pingpong: "+pongTime+", "+ pingTimeouts);
            $scope.pingTime = pongTime;
            $scope.pingTimeouts = pingTimeouts;
            $scope.$digest();
        })
    })
    .controller('NavbarController', function ($scope, $location, Status, Rating, Chat, Home, colors) {
        $scope.status = Status;
        $scope.chat = Chat;
        $scope.rating = Rating;
        $scope.newMessages = 0;
        $scope.$on("newChatMessage", function (event, count) {
            $scope.newMessages = count
        });
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
    .controller('EuropeController', function ($scope, europeSvgData) {
        $scope.europeSVG = europeSvgData;
        $scope.select = function(i) {
            console.log("select "+i);
            $scope.europeSVG[i].selected ^= true;
        }
    })
    .controller('ChatController', function ($scope, Status, Chat, colors, playerColors, $location, $anchorScroll, $routeParams) {
        $scope.chat = Chat;
        $scope.newCntPerPlayer = Chat.newCntPerPlayer;
        $scope.status = Status;
        $scope.$routeParams = $routeParams;
        $scope.colors = colors;
        $scope.playerColors = playerColors;
        $scope.scrollToItem = function (itemName) {
            //now scroll to it.
            $location.hash(itemName);
            $anchorScroll();
            $location.hash();
        };

    })
    .controller('PlayerChatController', function($scope, Status, Chat, colors, playerColors, $routeParams){
        $scope.status = Status;
        $scope.$routeParams = $routeParams;
        $scope.colors = colors;
        $scope.playerColors = playerColors;
        $scope.messages = Chat.messages;
        $scope.data = {};
        $scope.data.newMessage = "";
        $scope.$on('$viewContentLoaded', function (event) {
            console.log(event);
            Chat.messagesRead($scope.$routeParams.playerId);
        });
        $scope.chat = function (pid) {
            Chat.chat(pid, $scope.data.newMessage[pid]);
            $scope.data.newMessage[pid] = "";
        };
    })
    .controller('RatingController', function ($scope, Status, Rating, colors, playerColors) {
        $scope.status = Status;
        $scope.rating = Rating;
        $scope.colors = colors;
        $scope.myRatings = Rating.myRatings;
        $scope.avgRatings = $scope.rating.avgRatings;
        $scope.playerColors = playerColors;
        $scope.moodys = ["C", "CC", "CCC", "B", "BB", "BBB", "A", "AA", "AAA"];
        $scope.rate = function (id, val) {
            $scope.rating.rate(id, val);
        };
        //$scope.$watch(
        //    function (scope) {
        //        return scope.status.maxPlayers
        //    },
        //    function () {
        //        console.log("fill");
        //        $scope.rating.fillMyRatings();
        //    });
        //$scope.$watch(
        //    function (scope) {
        //        return scope.status.joined
        //    },
        //    function (newVal) {
        //        console.log("x");
        //        console.log($scope.status.rating);
        //        $scope.rating.setMyRatings($scope.status.rating);
        //        if (newVal) $scope.rating.rate(0, 0);
        //    });

    })
    .filter('isOtherPlayerThan', function () {
        return function (players,self) {
            return players.filter(function(p){
                if (!p.joined) return false;
                return p.playerId != self.playerId;
            });
        }

    });

