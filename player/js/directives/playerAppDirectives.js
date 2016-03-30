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
                        element.html("<div>"+html+"</div>");
                        $compile(element.contents())(scope);
                    });
                    console.log(element);
                    //$compile(element.contents())(scope);
                }
            };
        })
        .directive('slideshow', function() {
            return {
                restrict: 'E',
                scope: {},
                templateUrl: 'views/slideshow.html',
                link: function(scope, element, attrs) {
                    var images = scope.$parent.home.slideshowImages;
                    if (typeof images !== 'undefined') {
                        element.find('#slideshow').fadeShow({
                            images: images,
                            speed: 4600
                        });
                    }
                }
            };
        })

})();
