(function () {
    'use strict';

    angular.module('hvRecordingsFactory', ['ngResource']).factory('Recordings', function ($resource) {
        return $resource('/recordings/', null, {
            'get': {method: 'GET', isArray: true}
        });
    });

})();
