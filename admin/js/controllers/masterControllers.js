'use strict';

var masterControllers = angular.module('masterControllers', [])
    .controller('MasterPlaybackCtrl', function ($scope, Socket) {
        //$scope.options = null;
        $scope.goto = 0;
        $scope.status = {stepIndex: -1, type:"nix"};

        $scope.playback = function(cmd, param) {
            console.log("play clicked");
            Socket.emit("playbackAction", {cmd:cmd, param:param});
        };

        Socket.on("playBackStatus", function(status) {
            console.log("callback got "+status);
            $scope.status = status;
            console.log("got status info: "+JSON.stringify(status));
        });
        $scope.alert = function() {
            console.log("Alarm clicked");
            Socket.emit("alert");
        }

    });

masterControllers.controller('GameConfCtrl', function($scope, setFactory, itemOptions, gameConf, $filter, gettextCatalog) {
        //$scope.error = "kein Problem";
        $scope.decks = setFactory.decks;
        $scope.itemTypes = itemOptions.type;
        $scope.gameConf = gameConf.getRun(function() {
            console.log("getRunCallback!"+$scope.gameConf);
            if (!$scope.gameConf.typeMapping) $scope.gameConf.typeMapping = [];
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
            console.log('updateGameConf');

            if (typeof $scope.gameConf._id == "undefined") {
                var gConf = new gameConf({role:'run', startDeckId:null, autostart:false, playerCnt:1, typeMapping:[]});
                gConf.$save(function success(saved){
                        console.log("---success");                    },
                    function error(err){
                        console.error("---error: "+err);
                        console.error(err);
                        $scope.error = err.data;
                    });
                $scope.gameConf = gConf;
            }
            else {
                var updatedGameConf = angular.copy($scope.gameConf);
                angular.extend(updatedGameConf, data);
                delete updatedGameConf._id;   //sonst macht mongoDB auf dem raspi stunk
                var ret = gameConf.update(
                    { id: $scope.gameConf._id },
                    updatedGameConf,
                    function(data) {
                        console.log('successfully updated gameConf');
                    },
                    function error(err){
                        console.error('error saving gameConf', err);
                        console.error(err.stack);
                    }
                );
                return ret.$promise;
            }
        };
        $scope.addDeviceToType = function(id) {
            var t = $scope.gameConf.typeMapping[id];
            if (typeof $scope.gameConf.typeMapping === 'undefined') {
                $scope.gameConf.typeMapping = [];
            }
            $scope.gameConf.typeMapping[id].devices.push("");
            //$scope.deviceFrm.$show();
        };

        $scope.removeDeviceFromType = function(typeId, devId) {
            if (!confirm(gettextCatalog.getString('Really delete???'))) return;
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
            console.log("new log-message: "+data);
            $scope.messages.push(data);
        })

    });

masterControllers.controller('DeviceCtrl', function($scope, Socket, itemOptions) {
    $scope.deviceList = [];
    $scope.itemTypes = itemOptions.type;
    $scope.isCollapsed = true;
    Socket.on("DeviceList", function(data) {
        $scope.deviceList = data;
        console.log("got device list: "+JSON.stringify($scope.deviceList));
    });
    Socket.emit("getDeviceList");
    $scope.forceReload = function(role) {
        Socket.emit("forceReload", role);
    };
});

masterControllers.controller('PlayerCtrl', function($scope, Socket, playerColors) {
    $scope.playerList = [];
    $scope.ratings = [];
    Socket.on("status", function(data) {
        $scope.playerList = data.otherPlayers;
        $scope.playerColors = playerColors;
        $scope.ratings = data.avgRatings;
        console.log("got player list: "+JSON.stringify($scope.playerList));
    });
});

masterControllers.controller('OsCtrl', function($scope, Socket, gettextCatalog) {
    $scope.collapsed = {
        db: true,
        wlan1: true,
        osInfo: true,
        server: true
    };
    $scope.osInfo = {};
    $scope.dbStatus = {};
    $scope.socket = Socket;
    Socket.on("osinfo", function(data) {
        $scope.osInfo = data;
        console.log("got os info: "+JSON.stringify($scope.osInfo));
    });
    Socket.on("dbStatus", function(data) {
        $scope.dbStatus = data;
        console.log("got dbStatus: "+JSON.stringify($scope.dbStatus));
    });
    Socket.emit("database", "getStatus");
    Socket.emit("os", {cmd:"getInfo"});
    $scope.restartServer = function() {
        if (!confirm(gettextCatalog.getString('Do you really want to restart the server?'))) return;
        Socket.emit("os",{cmd:"restartServer"});
    };
    $scope.shutdown = function(reboot) {
        if (!confirm(gettextCatalog.getString('Are you sure?'))) return;
        if (!confirm(gettextCatalog.getString('REALLY REALLY SURE??????????'))) return;
        var d = reboot ? "reboot" : "shutdown";
        Socket.emit("os", {cmd:d});
    };
    $scope.restartWlan1 = function() {
        Socket.emit("os",  {cmd: "restartwlan1", param:{ssid:$scope.wlanId, passwd:$scope.wlanPasswd}});
    };
    $scope.dbAction = function(action) {
        if (!confirm("Wirklich DB:"+action+"?")) return;
        Socket.emit("database", action);
    };
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

    // update every automatically
    // disabled for now. too many mongo connections?!
    // $interval(function() {
    //     console.log('interval!');
    //     Socket.emit("database", "getStatus");
    //     Socket.emit("os", {cmd:"getInfo"});
    // }, 10000); // every 10 sec
});


