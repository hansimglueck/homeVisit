angular.module('hvLanguage', [])
    .factory('languageFactory', ['gettext', function(gettext) {

        var languages = [
            ['en', gettext('English')],
            ['de', gettext('German')],
            ['cs', gettext('Czech')],
            ['da', gettext('Danish')],
            ['fr', gettext('French')],
            ['nl', gettext('Dutch')],
            ['no', gettext('Norwegian')],
            ['pl', gettext('Polish')],
            ['pt', gettext('Portuguese')]
        ];

        var languageFactory = {};

        languageFactory.availableLanguages = languages;

        return languageFactory;
    }])
    .directive('languageChooser', function() {
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: '/homevisit_components/views/language-chooser.html',
            controller: function ($scope, Socket, languageFactory, gettextCatalog) {
                $scope.gettextCatalog = gettextCatalog;
                $scope.languages = languageFactory.availableLanguages;
                $scope.changeLanguage = function() {
                    Socket.emit('changeLanguage', gettextCatalog.getCurrentLanguage());
                };
            },
            scope: {}
        };
    });
