(function () {
    'use strict';

    angular.module('mcDirectives', [])
        .directive('playback', function () {
            return {
                restrict: 'AE',
                replace: 'true',
                templateUrl: '/mc/views/playback.html',
                controller: "PlaybackCtrl"
            };
        })
        .directive('deck', function () {
            return {
                restrict: 'AE',
                replace: 'true',
                templateUrl: '/mc/views/deck.html',
                controller: "DeckCtrl"
            };
        })
        .directive('item', function () {
            return {
                restrict: 'E',
                replace: 'true',
                templateUrl: '/mc/views/item.html',
                controller: 'ItemCtrl',
                scope: {},
                link: function ($scope, $element, $attributes) {
                    $scope.indexOffset = parseInt($attributes.indexOffset);
                }
            };
        })
        .directive('itemBlock', function () {
            return {
                restrict: 'E',
                replace: 'true',
                templateUrl: '/mc/views/item-block.html',
                scope: {
                    itemBlock: '=itemblock',
                    option: '=',
                    goto: '=',
                    active: '=',
                    index: '='
                },
                controller: function ($scope, Playback) {
                    $scope.playback = Playback.playback;
                }
            };
        })
        .directive('itemAsRow', function ($compile) {
            return {
                restrict: 'E',
                replace: 'true',
                templateUrl: '/mc/views/item-as-row.html',
                scope: {
                    item: '=',
                    index: '='
                },
                controller: function ($scope, gettextCatalog, Deck) {
                    $scope.lang = gettextCatalog.currentLanguage;
                    $scope.deck = Deck;
                    $scope.mainIndex = parseInt($scope.index);
                    $scope.itemIcons = {
                        'card': 'fa-file-text-o',
                        'vote': 'fa-check-square-o',
                        'sound': 'fa-music',
                        'inlineSwitch': 'fa-cloud-download',
                        'rating': 'fa-user-plus',
                        'config': 'fa-cogs',
                        'command': 'fa-clock-o',
                        'results': 'fa-pie-chart'
                    };
                    $scope.inlineDeckElements = [];
                },
                link: function (scope, element, attrs) {
                    scope.$watch('item.typeee', function(newValue, oldValue) {
                        if( oldValue === "inlineSwitch"){
                            deleteInlineDecks()
                        }
                        if( newValue === "inlineSwitch"){
                            appendInlineDecks()
                        }
                    }, true);
                    if (scope.item.type === "inlineSwitch") appendInlineDecks();
                    function appendInlineDecks() {
                        var el = element.find(".item-content");
                        scope.item.inlineDecks.forEach(function(inlineDeck, id){
                            var newElement = angular.element("<div><item-block class='script-list-block-row' ng-show='mainIndex > deck.stepIndex' itemblock='item.inlineDecks["+id+"].items' option='"+id+"' goto='false'></item-block></div>");
                            el.append(newElement);
                            scope.inlineDeckElements.push(newElement);
                        });
                        $compile(element.contents())(scope)
                    }
                    function deleteInlineDecks() {
                        scope.inlineDeckElements.forEach(function(el){
                            el.remove();
                        });
                        scope.inlineDeckElements = [];
                        //$compile(element.contents())(scope)
                    }
                }

            };
        })
        .directive('gameSessionChooser', function () {
            return {
                restrict: 'E',
                replace: 'true',
                templateUrl: '/mc/views/game-session-chooser.html',
                controller: function ($scope, gameSessionsFactory, $rootScope, Socket) {
                    $scope.sessions = gameSessionsFactory;
                    $scope.setSession = function () {
                        gameSessionsFactory.setSession();
                    };
                },
                scope: {}
            };
        });

})();
