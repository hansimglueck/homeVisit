(function() {
    'use strict';

    angular.module('homeVisitMCApp')
        .controller('RecordingsCtrl', function($scope, Recordings, Socket) {
            $scope.recordings = Recordings.get();
            $scope.upload = function(id, sid) {
                console.log('Uploading recording ' + id);
                Socket.emit('uploadRecording', { id: id, sid: sid });
            };
        });

})();
