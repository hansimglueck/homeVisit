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
    'angular.filter'
]);

app.run(function(editableOptions) {
//    editableThemes.bs3.buttonsClass = 'btn-sm';
    editableOptions.theme = 'bs3';
});

