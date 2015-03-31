'use strict';

var masterControllers = angular.module('masterControllers', [])
    .controller('MasterPlaybackCtrl', function ($scope, Socket) {
        //$scope.options = null;
        $scope.goto = 0;
        $scope.status = {stepId: -1, type:"nix"};

        $scope.playback = function(cmd, param) {
            console.log("play clicked");
            Socket.emit({type:"playbackAction", data:cmd, param:param}, function() { console.log('play emitted'); });
        };

        Socket.on("playBackStatus", function(message) {
            console.log("callback got "+message);
            var status = message.data;
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
        $scope.updateGameConf = function(data) {
            var updatedGameConf = angular.copy($scope.gameConf);
            angular.extend(updatedGameConf, data);
            delete updatedGameConf._id;   //sonst macht mongoDB auf dem raspi stunk
            if (typeof $scope.gameConf._id == "undefined") {
                var gConf = new gameConf({role:'run', startDeckId:null, autostart:false, playerCnt:1, typeMapping:[]});
                gConf.$save(function success(saved){
                        console.log("---success");
                    },
                    function error(err){
                        console.log("---error: "+err);
                        console.log(err);
                        $scope.error = err.data;
                    });
                $scope.gameConf = gConf;
            } else
            var ret = gameConf.update({id: $scope.gameConf._id}, updatedGameConf, function success(data) {
                //console.log("success");
                //console.log(data);
            }, function error(data){
                //alert(data);
                //console.log("error");
                //console.log(data);
            });
            //console.log(ret.$promise);

            return ret.$promise;
        };
        $scope.addDeviceToType = function(id) {
            var t = $scope.gameConf.typeMapping[id];
            $scope.gameConf.typeMapping[id].devices.push("");
            //$scope.deviceFrm.$show();
        };

        $scope.removeDeviceFromType = function(typeId, devId) {
            if (!confirm("Wirklich Löschen???")) return;
            var updatedTypeMapping = angular.copy($scope.gameConf.typeMapping);
            updatedTypeMapping[typeId].devices.splice(devId,1);
            $scope.updateGameConf({typeMapping: updatedTypeMapping}).then(function(x) {$scope.gameConf.typeMapping[typeId].devices.splice(devId,1);});
        };

        $scope.resetGameConf = function() {
            gameConf.delete({id:$scope.gameConf._id});
        };
    });

masterControllers.controller('LogCtrl', function($scope, Socket){
        $scope.messages = ["waiting..."];
        Socket.on('log', function(data) {
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
    Socket.on("DeviceList", function(message) {
        $scope.deviceList = message.data;
        console.log("got device list: "+JSON.stringify($scope.deviceList));
    });
    $scope.forceReload = function(role) {
        Socket.emit({type:"forceReload", data:role}, function() { console.log('force reload of '+role); });
    };
});

masterControllers.controller('PlayerCtrl', function($scope, Socket) {
    $scope.playerList = [];
    $scope.ratings = [];
    Socket.on("status", function(message) {
        $scope.playerList = message.data.otherPlayers;
        $scope.ratings = message.data.avgRatings;
        console.log("got player list: "+JSON.stringify($scope.playerList));
    });
});

masterControllers.controller('OsCtrl', function($scope, Socket) {
    $scope.collapsed = {
        db: true,
        wlan1: true,
        osInfo: true,
        server: true
    };
    $scope.osInfo = {};
    $scope.dbStatus = {};
    $scope.socket = Socket;
    $scope.restartServer = function() {
        if (!confirm("Wirklich Server neu starten?")) return;
        Socket.emit({type:"os", data:"restartServer"}, function() { console.log('restart-request sent'); });
    };
    $scope.shutdown = function(reboot) {
        if (!confirm("Wirklich Runterfahren???")) return;
        if (!confirm("WIRKLICH RUNTERFAHREN??????????")) return;
        var d = reboot ? "reboot" : "shutdown";
        Socket.emit({type:"os", data:d}, function() { console.log('shutdown send'); });
    };
    $scope.restartWlan1 = function() {
        Socket.emit({type:"os", data:"restartwlan1", para:{ssid:$scope.wlanId, passwd:$scope.wlanPasswd}}, function() { console.log('restart-request sent'); });
    };
    $scope.requestOsInfo = function() {
        Socket.emit({type:"os", data:"getInfo"}, function() { console.log('os info requested'); });
    };
    $scope.dbAction = function(action) {
        if (!confirm("Wirklich DB:"+action+"?")) return;
        Socket.emit({type:"database", data:action}, function() { console.log('db action requested: '+action); });
    };
    Socket.on("osinfo", function(message) {
        $scope.osInfo = message.data;
        console.log("got os info: "+JSON.stringify($scope.osInfo));
    });
    Socket.on("dbStatus", function(message) {
        $scope.dbStatus = message.data;
        console.log("got dbStatus: "+JSON.stringify($scope.dbStatus));
    });
    $scope.printInterfaces = function(iname) {
        if (typeof $scope.osInfo.interfaces == "undefined") return "fghj";
        var interfaces = "";
        Object.keys($scope.osInfo.interfaces).forEach(function(i, name){
            if (iname) {
                if (i.indexOf(iname)==-1) return;
            }
            interfaces+=i+": ";
            $scope.osInfo.interfaces[i].forEach(function(ver){
                interfaces+=ver.address+" ";
            });
            interfaces+=" - ";
        });
        return interfaces;
    }

});


