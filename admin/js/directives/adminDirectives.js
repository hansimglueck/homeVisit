(function() {
    'use strict';

    angular.module('adminDirectives', [])

        .directive('showSet', function () {
            return {
                restrict: 'AE',
                replace: 'true',
                templateUrl: 'views/admin/show-set.html'
            };
        })
        .directive('showDeck', function () {
            return {
                restrict: 'AE',
                replace: 'true',
                templateUrl: 'views/admin/show-deck.html'
            };
        })

        .directive('editNewDeck', function () {
            return {
                restrict: 'AE',
                replace: 'true',
                templateUrl: 'views/admin/edit-new-deck.html'
            };
        })

        .directive('showSequenceItem', function () {
            return {
                restrict: 'AE',
                replace: 'true',
                templateUrl: 'views/admin/show-sequence-item.html'
            };
        })


        .directive('showVoteOption', function () {
            return {
                restrict: 'AE',
                replace: 'true',
                templateUrl: 'views/admin/show-item-contents/show-vote-option.html',
                scope: {
                    item: '='
                },
                controller: function($scope, gettextCatalog) {
                    $scope.lang = gettextCatalog.currentLanguage;
                    $scope.saveVoteOption = function() {
                        console.log('saveVoteOption');
                        console.log($scope.$parent.$index);
                        return $scope.$parent.updateDeck($scope.$parent.deck);
                    };
                    $scope.deleteVoteOption = function(i) {
                        console.log('.deleteVoteOption', $scope.$parent.$index, i);
                        $scope.$parent.deck.items[$scope.$parent.$index].voteOptions.splice(i, 1);
                        $scope.$parent.updateDeck($scope.$parent.deck);
                    };
                }
            };
        })

        .directive('importJson', function () {
            return {
                restrict: 'AE',
                replace: 'true',
                templateUrl: 'views/admin/import-json.html'
            };
        })

        .directive('showCardContent', function () {
            return {
                restrict: 'AE',
                replace: 'true',
                templateUrl: 'views/admin/show-item-contents/show-card-content.html'
            };
        })

        .directive('showVoteContent', function () {
            return {
                restrict: 'AE',
                replace: 'true',
                templateUrl: 'views/admin/show-item-contents/show-vote-content.html'
            };
        })
        .directive('showDealContent', function () {
            return {
                restrict: 'AE',
                replace: 'true',
                templateUrl: 'views/admin/show-item-contents/show-deal-content.html'
            };
        })
        .directive('showAgreementContent', function () {
            return {
                restrict: 'AE',
                replace: 'true',
                templateUrl: 'views/admin/show-item-contents/show-agreement-content.html'
            };
        })

        .directive('showSwitchContent', function () {
            return {
                restrict: 'AE',
                replace: 'true',
                templateUrl: 'views/admin/show-item-contents/show-switch-content.html'
            };
        })
        .directive('showInlineSwitchContent', function () {
            return {
                scope: false,
                restrict: 'AE',
                replace: 'true',
                templateUrl: 'views/admin/show-item-contents/show-inline-switch-content.html'
            };
        })
        .directive('showInlineSwitchOption', function () {
            return {
                scope: false,
                restrict: 'AE',
                replace: 'true',
                templateUrl: 'views/admin/show-item-contents/show-inline-switch-option.html'
            };
        })

        .directive('showResultsContent', function () {
            return {
                restrict: 'AE',
                replace: 'true',
                templateUrl: 'views/admin/show-item-contents/show-results-content.html'
            };
        })
        .directive('showConfigContent', function () {
            return {
                restrict: 'AE',
                replace: 'true',
                templateUrl: 'views/admin/show-item-contents/show-config-content.html'
            };
        })

        .directive('showSoundContent', function () {
            return {
                restrict: 'AE',
                replace: 'true',
                templateUrl: 'views/admin/show-item-contents/show-sound-content.html'
            };
        })

        .directive('showCmdContent', function () {
            return {
                restrict: 'AE',
                replace: 'true',
                templateUrl: 'views/admin/show-item-contents/show-cmd-content.html'
            };
        })
        .directive('showRouletteContent', function () {
            return {
                restrict: 'AE',
                replace: 'true',
                templateUrl: 'views/admin/show-item-contents/show-roulette-content.html'
            };
        })

        .directive('showPlayerDirectContent', function () {
            return {
                restrict: 'AE',
                replace: 'true',
                templateUrl: 'views/admin/show-item-contents/show-player-direct-content.html'
            };
        })

        .directive('showEvalContent', function () {
            return {
                restrict: 'AE',
                replace: 'true',
                templateUrl: 'views/admin/show-item-contents/show-eval-content.html'
            };
        })

        .directive('showRatingContent', function () {
            return {
                restrict: 'AE',
                replace: 'true',
                templateUrl: 'views/admin/show-item-contents/show-rating-content.html'
            };
        })

         .directive('itemMapping', function () {
            return {
                restrict: 'AE',
                replace: 'true',
                templateUrl: 'views/admin/item-partials/item-mapping.html'
            };
        })
        .directive('itemButtons', function () {
            return {
                restrict: 'AE',
                replace: 'true',
                templateUrl: 'views/admin/item-partials/item-buttons.html'
            };
        })
        .directive('labeledItemOption', function () {
            return {
                restrict: 'E',
                replace: 'true',
                scope: {
                    item: '=',
                    title: '@',
                    field: '@',
                    type: '@',
                    saveitem: '&',
                    showtextforvalue: '&'
                },
                controller: function($scope, itemOptions, $filter, gettextCatalog) {
                    $scope.lang = gettextCatalog.currentLanguage;
                    $scope.itemOptions = itemOptions;
                    $scope.showTextForValue = function (item, option) {
                        var selected = [];
                        if (typeof item !== 'undefined' && item !== null && item[option]) {
                            selected = $filter('filter')(itemOptions[option], {value: item[option]}, true);
                        }
                        return selected.length ? selected[0].text : 'Not set';
                    };
                    $scope.addTag = function (field) {
                        console.log($scope.item);
                        $scope.item[field].push("");
                    };

                    $scope.removeTag = function (field, id) {
                        $scope.item[field].splice(id, 1);
                    };

                },

                templateUrl: 'views/admin/item-partials/labeled-item-option.html'
            };
        });

})();
