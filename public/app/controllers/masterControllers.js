'use strict';

angular.module('masterControllers', [])
    .controller('MasterPlaybackCtrl', function ($scope, Socket) {
        //$scope.options = null;

        $scope.playback = function(cmd) {
            console.log("play clicked");
            Socket.emit({type:"playbackAction", data:cmd}, function() { console.log('play emitted'); });
        };

        $scope.vote = function() {
            Socket.emit({type:"game", msg:"vote", data: $scope.options});
        };

    })

    .controller('GameConfCtrl', function($scope, setFactory, itemTypes, gameConf, $filter) {
        $scope.decks = setFactory.decks;
        $scope.itemTypes = itemTypes;
        $scope.gameConf = gameConf.getRun(function() {
            console.log("getRunCallback!"+$scope.gameConf);
            if ($scope.gameConf.typeMapping.length != $scope.itemTypes.length) {
                $scope.gameConf.typeMapping = [];
                angular.forEach($scope.itemTypes, function(type, id) {
                    $scope.gameConf.typeMapping.push({type:type.value, devices:[]});
                });
                $scope.updateGameConf();
            }
        });
        $scope.showDeck = function(conf) {
            var selected = [];
            if (conf.startDeckId) {
                selected = $filter('filter')($scope.decks, {_id: conf.startDeckId}, true);
            }
            return selected.length ? selected[0].title : 'Not set';
        };
        $scope.updateGameConf = function() {
            var updatedGameConf = angular.copy($scope.gameConf);
            delete updatedGameConf._id;   //sonst macht mongoDB auf dem raspi stunk
            gameConf.update({id: $scope.gameConf._id}, updatedGameConf, function(err) {});

        };

        $scope.addDeviceToType = function(id) {
            var t = $scope.gameConf.typeMapping[id];
            $scope.gameConf.typeMapping[id].devices.push("");
            //$scope.deviceFrm.$show();
        };

        $scope.removeDeviceFromType = function(typeId, devId) {
            if (!confirm("Wirklich Löschen???")) return;
            $scope.gameConf.typeMapping[typeId].devices.splice(devId,1);
            $scope.updateGameConf();
        };


    })

    .controller('LogCtrl', function($scope, Socket){
        $scope.messages = ["waiting..."];
        Socket.on('log', function(event) {
            var data = JSON.parse(event.data);
            console.log("new log-message: "+data.data);
            $scope.messages.push(data.data);
            if (data.content) {
                $scope.text = data.content.text;
                if (data.content.type == "vote") $scope.options = data.content.voteOptions;
            }
            else $scope.options = null;
        })

    })

    .controller('DeviceCtrl', function($scope, Socket, itemTypes) {
        $scope.deviceList = [];
        $scope.itemTypes = itemTypes;
        $scope.isCollapsed = true;
        Socket.on("DeviceList", function(event) {
            $scope.deviceList = JSON.parse(event.data).data;
            console.log("got device list: "+JSON.stringify($scope.deviceList));
        });
        //Socket.emit({type:"getDeviceList"});
    });


