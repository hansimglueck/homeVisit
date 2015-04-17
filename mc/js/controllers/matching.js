'use strict';

angular.module('homeVisitMCApp')
    .controller('MatchingCtrl', function ($scope, Polls) {
        $scope.polls = Polls;
    });
