angular.module('homeVisitMCApp')
    .controller('PlaybackCtrl', function ($scope, Status, Socket) {
        $scope.playback = function(cmd, param) {
            console.log("play clicked");
            Socket.emit("playbackAction", {cmd:cmd, param:param});
        };
        $scope.alert = function() {
            console.log("Alarm clicked");
            Socket.emit("alert");
        }

    });
