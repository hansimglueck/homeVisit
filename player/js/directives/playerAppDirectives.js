(function() {
    'use strict';

    angular.module('playerAppDirectives', [])

        .directive('notJoined', function () {
            return {
                restrict: 'AE',
                replace: 'true',
                templateUrl: 'views/not-joined.html'
            };
        })
        .directive('europeMap', function () {
            return {
                restrict: 'AE',
                replace: 'true',
                templateUrl: 'views/europe.html'
            };
        })
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
                templateUrl: 'views/player-icon.html'
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
                templateUrl: 'views/player-app-icon-full.html'
            };
        })
        .directive('playerAppIcon', function () {
            return {
                restrict: 'AE',
                replace: 'true',
                scope: {
                    icon: '='
                },
                templateUrl: 'views/player-app-icon.html'
            };
        })
        .directive('dealHeader', function () {
            return {
                restrict: 'AE',
                replace: 'true',
                scope: {
                    pid0: '=',
                    pid1: '='
                },
                 templateUrl: 'views/deal-header.html'
            };
        })
        .directive('test', function ($compile) {
            return {
                restrict: 'E',
                scope: {text: '=text'},
                template: '<p ng-click="add()">{{text}}</p>',
                controller: function ($scope, $element) {
                    $scope.add = function () {
                        var el = $compile("<test text='n'></test>")($scope);
                        $element.parent().append(el);
                    };
                }
            };
        })
        .directive('card', function($compile) {
            return {
                restrict: 'E',
                scope: {text: '='},
                template: "<div></div>",
                link: function(scope, element, attrs) {
                    console.log("text="+scope.text);
                    scope.$watch( 'text' , function(html){
                        element.html(html);
                        $compile(element.contents())(scope);
                    });
                    console.log(element);
                    //$compile(element.contents())(scope);
                }
            };
        })
        .directive('keypad', function() {
            return {
                restrict: 'E',
                templateUrl: 'views/keyboard.html',
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
                            $scope.home.options[0].value = v;
                            $scope.vote(0);
                        }
                    };
                }
            };
        });

})();
