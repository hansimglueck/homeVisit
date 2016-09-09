(function() {
    'use strict';

    angular.module('homeVisitMCApp')
        .controller('NavCtrl', function($scope, $location) {
            $scope.isActive = function(route) {
                //console.log("isActive " + route + "==" + $location.path());
                return route === $location.path();
            };
            $scope.hi = function(txt) {
                console.log("clicked "+txt);
            };
        });

})();
