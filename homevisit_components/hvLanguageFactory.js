angular.module('hvLanguageFactory', [])
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
            ]

        var languageFactory = {};

        languageFactory.availableLanguages = languages;
        languageFactory.languagesByCode = {};
        for (var i = 0; i < languages.length; ++i) {
            languageFactory.languagesByCode[languages[i][0]] = languages[i][1];
        }

        return languageFactory;

    }]);
