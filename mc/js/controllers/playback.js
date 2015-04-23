angular.module('homeVisitMCApp')
    .controller('PlaybackCtrl', function ($scope, Status, Socket, gettext, languageFactory, gettextCatalog) {
        $scope.gettextCatalog = gettextCatalog;
        $scope.languages = languageFactory.availableLanguages;
        $scope.getLanguageNameByCode = languageFactory.getNameByCode;
        $scope.changeLanguage = function() {
            Socket.emit('changeLanguage', gettextCatalog.getCurrentLanguage());
        };
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
