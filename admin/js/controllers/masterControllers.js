/* global confirm */

(function() {
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
            };
        });

    masterControllers.controller('GameConfCtrl', function($scope, setFactory, itemOptions, GameConf, $filter, gettextCatalog) {
            //$scope.error = "kein Problem";
            $scope.decks = setFactory.decks;
            $scope.itemTypes = itemOptions.type;
            $scope.gameConf = GameConf.getRun(function() {
                console.log("getRunCallback!"+$scope.gameConf);
                if (!$scope.gameConf.typeMapping) {
                    $scope.gameConf.typeMapping = [];
                }
                if ($scope.gameConf.typeMapping.length !== $scope.itemTypes.length) {
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

                if (typeof $scope.gameConf._id === "undefined") {
                    var gConf = new GameConf({role:'run', startDeckId:null, autostart:false, playerCnt:1, typeMapping:[]});
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
                    var ret = GameConf.update(
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
                if (typeof $scope.gameConf.typeMapping === 'undefined') {
                    $scope.gameConf.typeMapping = [];
                }
                $scope.gameConf.typeMapping[id].devices.push("");
                //$scope.deviceFrm.$show();
            };

            $scope.removeDeviceFromType = function(typeId, devId) {
                if (!confirm(gettextCatalog.getString('Really delete???'))) {
                    return;
                }
                var updatedTypeMapping = angular.copy($scope.gameConf.typeMapping);
                updatedTypeMapping[typeId].devices.splice(devId,1);
                $scope.updateGameConf({typeMapping: updatedTypeMapping}).then(function(x) {$scope.gameConf.typeMapping[typeId].devices.splice(devId,1);});
            };

            $scope.resetGameConf = function() {
                GameConf.delete({id:$scope.gameConf._id});
            };
        });

    masterControllers.controller('LogCtrl', function($scope, Socket){
            $scope.messages = ["waiting..."];
            Socket.on('log', function(data) {
                console.log("new log-message: "+data);
                $scope.messages.push(data);
            });
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
        });
    });

    masterControllers.controller('MasterMindCtrl', function($scope, $timeout, Nodes) {
        $scope.nodes = Nodes.get();
        // auto-update
        (function cb() {
            $scope.nodes = Nodes.get(function() {
                $timeout(cb, 12000);
            });
        })();
    });

})();
