(function() {
    'use strict';

    var app = angular.module('homevisitAdmin', [
        'adminControllers',
        'masterControllers',
        'adminDirectives',
        'masterDirectives',
        'gameServices',
        'WebsocketServices',
        'ui.sortable',
        'ui.bootstrap',
        'xeditable',
        'luegg.directives',
        'angular.filter',
        'ngRoute',
        'hvPlayerColors',
        'hvItemOptions',
        'hvSetFactory',
        'hvLanguage',
        'gettext',
        'hvDirectives',
        'hvRecordingsFactory',
        'hvBrainControl',
        'angularModalService'
    ])
    .config(function ($routeProvider, $anchorScrollProvider) {
    //        $locationProvider.html5Mode(true);
            $anchorScrollProvider.disableAutoScrolling();
            $routeProvider.
                when('/home', {
                    templateUrl: '/admin/partials/home.html',
                    controller: 'HomeController'
                }).
                otherwise({
                    redirectTo: '/home'
                });
        });
    app.run(function(editableOptions, Socket, gettextCatalog, $location, SystemInfo) {
    //    editableThemes.bs3.buttonsClass = 'btn-sm';
        editableOptions.theme = 'bs3';
        var masterMind = $location.absUrl().search(/mastermind/) >= 0;
        if (!masterMind) {
            Socket.connect('master', function() {
                Socket.emit('getLanguage');
                SystemInfo.start();
            });
            Socket.on('languageChange', function (data) {
                gettextCatalog.setCurrentLanguage(data.language);
            });
        }
    });

})();
