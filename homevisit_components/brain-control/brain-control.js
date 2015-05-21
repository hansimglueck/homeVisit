(function () {
    'use strict';

    angular.module('hvBrainControl', [])
        .directive('raspiManager', function () {
            return {
                restrict: 'AE',
                replace: 'true',
                templateUrl: '/homevisit_components/brain-control/views/raspi-manager.html',
                controller: function ($scope, Socket, gettextCatalog, SystemInfo, ModalService) {
                    $scope.systemInfo = SystemInfo;
                    $scope.collapsed = {
                        db: true,
                        wlan1: true,
                        osInfo: true,
                        server: true
                    };
                    $scope.socket = Socket;
                    $scope.restartServer = function () {
                        if (!confirm(gettextCatalog.getString('Do you really want to restart the server?'))) {
                            return;
                        }
                        SystemInfo.restartServer();
                    };
                    $scope.shutdown = function (reboot) {
                        if (!confirm(gettextCatalog.getString('Are you sure?'))) {
                            return;
                        }
                        if (!confirm(gettextCatalog.getString('REALLY REALLY SURE??????????'))) {
                            return;
                        }
                        SystemInfo.shutdown(reboot);
                    };
                    $scope.restartWlan1 = function () {
                        SystemInfo.restartWlan1();
                    };
                    $scope.scanWifi = function () {
                        SystemInfo.scanWifi();
                    };
                    $scope.connectWifi = function (id) {
                        $scope.collapsed.wlan1 = true;
                        showWifiModal(SystemInfo.wifiList[id]);
                    };
                    $scope.dbAction = function (action) {
                        if (!confirm(gettextCatalog.getString('Really DB: {{action}}?', {action: action}))) {
                            return;
                        }
                        SystemInfo.dbAction(action);
                    };
                    $scope.requestServerInfo = function () {
                        SystemInfo.requestServerInfo();
                    };
                    $scope.printInterfaces = function (iname) {
                        if (typeof SystemInfo.osInfo.interfaces === "undefined") {
                            return gettextCatalog.getString("N/A");
                        }
                        var interfaces = "";
                        Object.keys(SystemInfo.osInfo.interfaces).forEach(function (i, name) {
                            if (iname && i.indexOf(iname) === -1) {
                                return;
                            }
                            interfaces += i + ": ";
                            SystemInfo.osInfo.interfaces[i].forEach(function (ver) {
                                interfaces += ver.address + " ";
                            });
                            interfaces += " - ";
                        });
                        return interfaces;
                    };
                    function showWifiModal(ssid) {
                        // Just provide a template url, a controller and call 'showModal'.
                        ModalService.showModal({
                            templateUrl: "/homevisit_components/brain-control/views/wifi-modal.html",
                            controller: function ($scope, ssid, close, $element) {
                                $scope.ssid = ssid;
                                $scope.password = "";
                                $scope.closeModal = function (password) {
                                    $element.modal('hide');
                                    //  Now close as normal, but give 500ms for bootstrap to animate
                                    close({ssid: $scope.ssid, password: $scope.password}, 500);
                                };
                            },
                            inputs: {
                                ssid: ssid
                            }
                        }).then(function (modal) {
                            // The modal object has the element built, if this is a bootstrap modal
                            // you can call 'modal' to show it, if it's a custom modal just show or hide
                            // it as you need to.
                            modal.element.modal();
                            modal.close.then(function (result) {
                                SystemInfo.restartWlan1(result);
                            });
                        });


                    }

                }
            };
        })
        .factory('SystemInfo', function (Socket) {
            var infoFactory = {};
            infoFactory.wifiList = [];
            infoFactory.osInfo = {};
            infoFactory.dbStatus = {};
            infoFactory.wlan1Message = {
                text: "",
                spin: false
            }
            ;

            infoFactory.start = function () {
                Socket.on("wifi-list", function (data) {
                    infoFactory.wifiList = data;
                    infoFactory.wlan1Message.text = "";
                    infoFactory.wlan1Message.spin = false;
                });
                Socket.on("wifi-message", function (data) {
                    infoFactory.wlan1Message.text = data;
                    infoFactory.wlan1Message.spin = false;
                });
                Socket.on("osinfo", function (data) {
                    infoFactory.osInfo = data;
                    console.log("got os info: " + JSON.stringify(infoFactory.osInfo));
                });
                Socket.on("dbStatus", function (data) {
                    infoFactory.dbStatus = data;
                    console.log("got dbStatus: " + JSON.stringify(infoFactory.dbStatus));
                });
                infoFactory.requestServerInfo();
            };
            infoFactory.scanWifi = function () {
                Socket.emit("os", {cmd: "scanWifi"});
                infoFactory.wlan1Message.text = "scanning for wifi";
                infoFactory.wlan1Message.spin = true;
            };
            infoFactory.restartServer = function () {
                Socket.emit("os", {cmd: "restartServer"});
            };
            infoFactory.shutdown = function (reboot) {
                Socket.emit("os", {cmd: d});
            };
            infoFactory.restartWlan1 = function (wifi) {
                infoFactory.wlan1Message.text = "Connecting to " + wifi.ssid + "...";
                infoFactory.wlan1Message.spin = true;
                Socket.emit("os", {
                    cmd: "restartwlan1",
                    param: {ssid: wifi.ssid, passwd: wifi.password}
                });
            };
            infoFactory.dbAction = function (action) {
                Socket.emit("database", action);
            };
            infoFactory.requestServerInfo = function () {
                Socket.emit("database", "getStatus");
                Socket.emit("os", {cmd: "getInfo"});
            };
            return infoFactory;
        });

})();
