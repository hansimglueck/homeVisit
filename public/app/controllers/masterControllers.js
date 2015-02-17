'use strict';

var masterControllers = angular.module('masterControllers', [])
    .controller('MasterPlaybackCtrl', function ($scope, Socket) {
        //$scope.options = null;
        $scope.status = {stepId: -1, type:"nix"};

        $scope.playback = function(cmd) {
            console.log("play clicked");
            Socket.emit({type:"playbackAction", data:cmd}, function() { console.log('play emitted'); });
        };

        Socket.on("status", function(event) {
            var status = JSON.parse(event.data).data;
            $scope.status = status;
            console.log("got status info: "+JSON.stringify(status));
        });

    });

masterControllers.controller('GameConfCtrl', function($scope, setFactory, itemTypes, gameConf, $filter) {
        //$scope.error = "kein Problem";
        $scope.decks = setFactory.decks;
        $scope.itemTypes = itemTypes;
        $scope.gameConf = gameConf.getRun(function() {
            console.log("getRunCallback!"+$scope.gameConf);
            if ($scope.gameConf.typeMapping.length != $scope.itemTypes.length) {
                $scope.gameConf.typeMapping = [];
                angular.forEach($scope.itemTypes, function(type) {
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
            if (typeof $scope.gameConf._id == "undefined") {
                var gConf = new gameConf({role:'run', startDeckId:null, autostart:false, playerCnt:1, typeMapping:[]});
                gConf.$save(function success(){
                    console.log("---success");},
                    function error(err){
                        console.log("---error: "+err);
                        console.log(err);
                        $scope.error = err.data;
                    });
                $scope.gameConf = gConf;
            } else
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


    });

masterControllers.controller('LogCtrl', function($scope, Socket){
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

    });

masterControllers.controller('DeviceCtrl', function($scope, Socket, itemTypes) {
    $scope.deviceList = [];
    $scope.itemTypes = itemTypes;
    $scope.isCollapsed = true;
    Socket.on("DeviceList", function(event) {
        $scope.deviceList = JSON.parse(event.data).data;
        console.log("got device list: "+JSON.stringify($scope.deviceList));
    });
});

masterControllers.controller('OsCtrl', function($scope, Socket) {
    $scope.osInfo = {};
    $scope.shutdown = function() {
        if (!confirm("Wirklich Runterfahren???")) return;
        if (!confirm("WIRKLICH RUNTERFAHREN??????????")) return;
        Socket.emit({type:"os", data:"shutdown"}, function() { console.log('shutdown send'); });
    };
    $scope.requestOsInfo = function() {
        Socket.emit({type:"os", data:"getInfo"}, function() { console.log('os info requested'); });
    }
    Socket.on("osinfo", function(event) {
        $scope.osInfo = JSON.parse(event.data).data;
        console.log("got os info: "+JSON.stringify($scope.osInfo));
    });
    $scope.printInterfaces = function() {
        if (typeof $scope.osInfo.interfaces == "undefined") return "fghj";
        var interfaces = "";
        Object.keys($scope.osInfo.interfaces).forEach(function(i, name){
            interfaces+=i+": ";
            $scope.osInfo.interfaces[i].forEach(function(ver){
                interfaces+=ver.address+" ";
            });
            interfaces+=" - ";
        });
        return interfaces;
    }

});


