/**
 * Created by jeanbluer on 06.02.15.
 */
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
            templateUrl: 'views/admin/show-item-contents/show-vote-option.html'
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
    .directive('showTradeContent', function () {
        return {
            restrict: 'AE',
            replace: 'true',
            templateUrl: 'views/admin/show-item-contents/show-trade-content.html'
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
            restrict: 'AE',
            replace: 'true',
            templateUrl: 'views/admin/show-item-contents/show-inline-switch-content.html'
        };
    })
    .directive('showInlineSwitchOption', function () {
        return {
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

    .directive('directItem', function () {
        return {
            restrict: 'AE',
            replace: 'true',
            templateUrl: 'views/admin/show-direct-item.html'
        };
    })

;
