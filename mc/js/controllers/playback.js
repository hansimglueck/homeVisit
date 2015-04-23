angular.module('homeVisitMCApp')
    .controller('PlaybackCtrl', function ($scope, Status, Socket, gettext) {
        $scope.playback = function(cmd, param) {
            console.log("play clicked");
            if (cmd == "restart") {
                if (!confirm(gettext('Really restart?'))) {
                    return;
                }
            }
            Socket.emit("playbackAction", {cmd:cmd, param:param});
        };
        $scope.alert = function() {
            console.log("Alarm clicked");
            Socket.emit("alert");
        }

    });
