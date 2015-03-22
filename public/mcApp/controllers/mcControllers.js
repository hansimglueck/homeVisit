angular.module("mcControllers", [])
    .controller('HomeController', function ($scope, Socket) {
        $scope.playback = function(cmd, param) {
            console.log("play clicked");
            Socket.emit({type:"playbackAction", data:cmd, param:param}, function() { console.log('play emitted'); });
        };
        $scope.alarmGruen = function() {
            var param = 0;
            Socket.emit({type: "forward", recipient: {role:"button", name:"gruen"}, data: {type:"button_led", content:{command: 'alarm', param: param}}},
                function() { console.log('mc command emitted'); });
        };
        $scope.alarmGruenUndRot = function() {
            var param = 0;
            Socket.emit({type: "forward", recipient: {role:"button", name:"gruen"}, data: {type:"button_led", content:{command: 'alarm', param: param}}},
                function() { console.log('mc command emitted'); });
            Socket.emit({type: "forward", recipient: {role:"button", name:"rot"}, data: {type:"button_led", content:{command: 'alarm', param: param}}},
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
;

