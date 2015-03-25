angular.module("mcControllers", [])
    .controller('AlarmController', function ($scope, Socket) {
        $scope.playback = function(cmd, param) {
            console.log("play clicked");
            Socket.emit({type:"playbackAction", data:cmd, param:param}, function() { console.log('play emitted'); });
        };
        $scope.alarmGruen = function() {
            var param = 0;
            Socket.emit({type: "forward", recipient: {role:"button", name:"gruen"}, data: {type:"display", content:{command: 'alarm', param: param}}},
                function() { console.log('mc command emitted'); });
        };
        $scope.alarmGruenUndRot = function() {
            var param = 0;
            Socket.emit({type: "forward", recipient: {role:"button", name:"gruen"}, data: {type:"display", content:{command: 'alarm', param: param}}},
                function() { console.log('mc command emitted'); });
            Socket.emit({type: "forward", recipient: {role:"button", name:"rot"}, data: {type:"display", content:{command: 'alarm', param: param}}},
                function() { console.log('mc command emitted'); });
        };
    })
    .controller('MenuController', function ($scope, Socket) {
        $scope.socket = Socket;
        $scope.pingpong = Socket.getPingPong();
        $scope.$on("disconnected", function () {
            console.log("MenuController got 'disconnected'");
        });
        $scope.$on("pingpong", function (event, pongTime, pingTimeouts) {
            //console.log("pingpong: "+pongTime+", "+ pingTimeouts);
            $scope.pingTime = pongTime;
            $scope.pingTimeouts = pingTimeouts;
            $scope.$digest();
        })

    })
    .controller('NavbarController', function ($scope, Socket) {

    })
    .controller('HomeController', function ($scope, Socket, Status, colors) {
        $scope.colors = colors;
        $scope.status = Status;
        $scope.getPlayersOrdered = function() {
            if (Status.otherPlayers.length == 0) return;
            var players = $scope.status.otherPlayers.filter(function(p){return p.joined;});
            var ordered = [];
            var mySeat = 0;//players.map(function(p,id){return {id:id, playerId: p.playerId}}).filter(function(pp){return pp.playerId == 0})[0].id;
            var oppositeSeat = (mySeat + Math.floor(players.length/2))%players.length;
            var seat;
            var p = null;
            for (var i = 0; i < players.length; i++) {
                if (i%2 == 1) {
                    //rechts rum
                    seat = oppositeSeat + Math.ceil(i/2);
                } else {
                    //links rum
                    seat = oppositeSeat - Math.floor(i/2);
                }
                seat += players.length;
                seat %= players.length;
                p = getPlayerForSeat(seat);
                if (p!= null) if(p.playerId != Status.player.playerId) ordered.push(p);
            }

            return ordered;
        };
        function getPlayerForSeat(id) {
            var arr = $scope.status.otherPlayers.filter(function(p){return p.joined});
            if (arr.length > 0) return arr[id];
            else return null;
        }

    })

    .controller('PlayerController', function ($scope, Socket, Status, colors, $routeParams, $location) {
        $scope.playerId = $routeParams.playerId;
        $scope.colors = colors;
        $scope.status = Status;
        $scope.score = function(playerId, score) {
            console.log("score "+score);
            score = parseInt(score);
            Socket.emit({type: "score", data: {playerId:playerId, score:score}},
                function() { console.log('mc command emitted'); });

            $location.url("/home");
        }

    })

;

