(function () {
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
                    $scope.lang = gettextCatalog.currentLanguage;
                    $scope.playerColornames = playerColornamesFactory.playercolornames;
                    $scope.playerTextColors = playerTextColors;
                    $scope.getColorName = function (color) {
                        return gettextCatalog.getString(color);
                    }
                },
                templateUrl: '/homevisit_components/views/player-icon.html'
            };
        })
        .directive('ownPlayerIcon', function () {
            return {
                restrict: 'AE',
                replace: 'true',
                transclude: true,
                controller: function ($scope, playerColors, playerColornamesFactory, playerTextColors, gettextCatalog, Status) {
                    $scope.playerId = Status.player.playerId;
                    $scope.playerColors = playerColors;
                    $scope.lang = gettextCatalog.currentLanguage;
                    $scope.playerColornames = playerColornamesFactory.playercolornames;
                    $scope.playerTextColors = playerTextColors;
                    $scope.getColorName = function (color) {
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
        .directive('recordings', function () {
            return {
                restrict: 'AE',
                replace: 'true',
                templateUrl: '/homevisit_components/views/recordings.html',
                controller: function ($scope, Socket, gettextCatalog, Recordings) {
                    $scope.isCollapsed = true;
                    $scope.recordings = Recordings.get();
                    $scope.getDate = function(ts) {
                        return new Date(ts*1000);
                    }
                }
            };
        })
        .directive('keypad', function() {
            return {
                restrict: 'E',
                scope: {
                    currency: "=",
                    submit: "&"
                },
                templateUrl: '/homevisit_components/views/keyboard.html',
                controller: function($scope, $element) {
                    var disp = $element.find('.disp');
                    $scope.enterNum = function(num) {
                        var newtext = disp.text() + num;
                        if (newtext.length < 10) {
                            disp.text(newtext);
                        }
                    };
                    $scope.bksp = function() {
                        var newtext = disp.text();
                        if (newtext.length > 0) {
                            disp.text(newtext.slice(0, -1));
                        }
                    };
                    $scope.accept = function() {
                        var v = disp.text();
                        if (v.length > 0) {
                            $scope.submit({number:v});
                        }
                    };
                }
            };
        });


})();
