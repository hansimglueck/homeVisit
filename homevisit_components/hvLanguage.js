(function () {
    'use strict';

    angular.module('hvLanguage', [])
        .factory('languageFactory', function (gettextCatalog) {

            // new language hast to be defined here and in game/gettext.js!!

            var languages = [
                ['en', gettextCatalog.getString('English')],
                ['de', gettextCatalog.getString('German')],
                ['cs', gettextCatalog.getString('Czech')],
                ['da', gettextCatalog.getString('Danish')],
                ['fr', gettextCatalog.getString('French')],
                ['nl', gettextCatalog.getString('Dutch')],
                ['no', gettextCatalog.getString('Norwegian')],
                ['pl', gettextCatalog.getString('Polish')],
                ['pt', gettextCatalog.getString('Portuguese')],
                ['gl', gettextCatalog.getString('Galician')],
                ['it', gettextCatalog.getString('Italian')],
                ['ru', gettextCatalog.getString('Russian')],
		        ['fr_CH', gettextCatalog.getString('SwissFrench')]
            ];

            var languageFactory = {};

            languageFactory.availableLanguages = languages;

            return languageFactory;
        })
        .directive('languageChooser', function () {
            return {
                restrict: 'E',
                replace: 'true',
                templateUrl: '/homevisit_components/views/language-chooser.html',
                controller: function ($scope, Socket, languageFactory, gettextCatalog) {
                    $scope.gettextCatalog = gettextCatalog;
                    $scope.languages = languageFactory.availableLanguages;
                    $scope.changeLanguage = function () {
                        Socket.emit('changeLanguage', gettextCatalog.getCurrentLanguage());
                    };
                },
                scope: {}
            };
        });

})();
