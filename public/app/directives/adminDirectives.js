/**
 * Created by jeanbluer on 06.02.15.
 */
angular.module('adminDirectives', [])

    .directive('showSet', function () {
        return {
            restrict: 'AE',
            replace: 'true',
            templateUrl: 'app/views/admin/show-set.html'
        };
    })
    .directive('showDeck', function () {
        return {
            restrict: 'AE',
            replace: 'true',
            templateUrl: 'app/views/admin/show-deck.html'
        };
    })

    .directive('editNewDeck', function () {
        return {
            restrict: 'AE',
            replace: 'true',
            templateUrl: 'app/views/admin/edit-new-deck.html'
        };
    })

    .directive('showSequenceItem', function () {
        return {
            restrict: 'AE',
            replace: 'true',
            templateUrl: 'app/views/admin/show-sequence-item.html'
        };
    })


    .directive('showVoteOption', function () {
        return {
            restrict: 'AE',
            replace: 'true',
            templateUrl: 'app/views/admin/show-vote-option.html'
        };
    })

    .directive('importJson', function () {
        return {
            restrict: 'AE',
            replace: 'true',
            templateUrl: 'app/views/admin/import-json.html'
        };
    })

    .directive('showCardContent', function () {
        return {
            restrict: 'AE',
            replace: 'true',
            templateUrl: 'app/views/admin/show-item-contents/show-card-content.html'
        };
    })

    .directive('showVoteContent', function () {
        return {
            restrict: 'AE',
            replace: 'true',
            templateUrl: 'app/views/admin/show-item-contents/show-vote-content.html'
        };
    })

    .directive('showSwitchContent', function () {
        return {
            restrict: 'AE',
            replace: 'true',
            templateUrl: 'app/views/admin/show-item-contents/show-switch-content.html'
        };
    })

    .directive('showResultsContent', function () {
        return {
            restrict: 'AE',
            replace: 'true',
            templateUrl: 'app/views/admin/show-item-contents/show-results-content.html'
        };
    })

    .directive('showSoundContent', function () {
        return {
            restrict: 'AE',
            replace: 'true',
            templateUrl: 'app/views/admin/show-item-contents/show-sound-content.html'
        };
    })

;