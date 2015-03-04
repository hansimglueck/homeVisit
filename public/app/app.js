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
    'ngRoute'
])
.config(function ($routeProvider, $anchorScrollProvider) {
//        $locationProvider.html5Mode(true);
        $anchorScrollProvider.disableAutoScrolling();
        $routeProvider.
            when('/home', {
                templateUrl: '/app/partials/home.html',
                controller: 'HomeController'
            }).
            otherwise({
                redirectTo: '/home'
            });
    });

app.run(function(editableOptions) {
//    editableThemes.bs3.buttonsClass = 'btn-sm';
    editableOptions.theme = 'bs3';
});

