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
            controller: function ($scope, playerColors) {
                $scope.playerColors = playerColors;
            },
            templateUrl: 'views/player-icon.html'
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
            template: "<li></li>",
            link: function(scope, element, attrs) {
                element.append = scope.text;
                console.log(element);
                $compile(element.contents())(scope);
            }
        }
    });;
