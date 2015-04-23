/**
 * Created by jeanbluer on 16.01.15.
 */
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
    'hvLanguageFactory',
    'gettext'
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
app.run(function(editableOptions, Socket, gettextCatalog) {
//    editableThemes.bs3.buttonsClass = 'btn-sm';
    editableOptions.theme = 'bs3';
    Socket.connect('master', function() {
        Socket.emit('getLanguage');
    });
    Socket.on('languageChange', function (data) {
        gettextCatalog.setCurrentLanguage(data.language);
    });
});
