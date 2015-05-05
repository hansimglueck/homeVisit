(function() {
    'use strict';

    angular.module('hvDirectives', ['hvPlayerColors'])

        .directive('playerIcon', function () {
            return {
                restrict: 'AE',
                replace: 'true',
                scope: {
                    playerId: '=pid'
                },
                transclude: true,
                controller: function ($scope, playerColors, playerColornamesFactory, playerTextColors, gettextCatalog) {
                    $scope.playerColors = playerColors;
                    $scope.playerColornames = playerColornamesFactory.playercolornames;
                    $scope.playerTextColors = playerTextColors;
                    $scope.getColorName = function(color) {
                        return gettextCatalog.getString(color);
                    }
                },
                templateUrl: '/homevisit_components/views/player-icon.html'
            };
        })
        .directive('playerAppIconFull', function () {
            return {
                restrict: 'AE',
                replace: 'true',
                scope: {
                    icon: '=',
                    playerId: '=pid'
                },
                templateUrl: '/homevisit_components/views/player-app-icon-full.html'
            };
        })
        .directive('playerAppIcon', function () {
            return {
                restrict: 'AE',
                replace: 'true',
                scope: {
                    icon: '='
                },
                templateUrl: '/homevisit_components/views/player-app-icon.html'
            };
        })

})();
