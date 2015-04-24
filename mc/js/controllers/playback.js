angular.module('homeVisitMCApp')
    .controller('PlaybackCtrl', function ($scope, Socket, languageFactory, gettextCatalog, Playback) {
        $scope.gettextCatalog = gettextCatalog;
        $scope.languages = languageFactory.availableLanguages;
        $scope.getLanguageNameByCode = languageFactory.getNameByCode;
        $scope.changeLanguage = function() {
            Socket.emit('changeLanguage', gettextCatalog.getCurrentLanguage());
        };
        $scope.playback = Playback.playback;
        $scope.alert = Playback.alert;
    });
