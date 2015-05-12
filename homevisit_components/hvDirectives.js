(function () {
    'use strict';

    angular.module('hvDirectives', ['hvPlayerColors'])

        .directive('playerIcon', function () {
            return {
                restrict: 'AE',
                replace: 'true',
                scope: {
                    playerId: '=pid'
                },
                transclude: true,
                controller: function ($scope, playerColors, playerColornamesFactory, playerTextColors, gettextCatalog) {
                    $scope.playerColors = playerColors;
                    $scope.playerColornames = playerColornamesFactory.playercolornames;
                    $scope.playerTextColors = playerTextColors;
                    $scope.getColorName = function (color) {
                        return gettextCatalog.getString(color);
                    }
                },
                templateUrl: '/homevisit_components/views/player-icon.html'
            };
        })
        .directive('playerAppIconFull', function () {
            return {
                restrict: 'AE',
                replace: 'true',
                scope: {
                    icon: '=',
                    playerId: '=pid'
                },
                templateUrl: '/homevisit_components/views/player-app-icon-full.html'
            };
        })
        .directive('playerAppIcon', function () {
            return {
                restrict: 'AE',
                replace: 'true',
                scope: {
                    icon: '='
                },
                templateUrl: '/homevisit_components/views/player-app-icon.html'
            };
        })
        .directive('raspiManager', function () {
            return {
                restrict: 'AE',
                replace: 'true',
                templateUrl: '/homevisit_components/views/raspi-manager.html',
                controller: function ($scope, Socket, gettextCatalog) {
                    $scope.collapsed = {
                        db: true,
                        wlan1: true,
                        osInfo: true,
                        server: true
                    };
                    $scope.osInfo = {};
                    $scope.dbStatus = {};
                    $scope.socket = Socket;
                    Socket.on("osinfo", function (data) {
                        $scope.osInfo = data;
                        console.log("got os info: " + JSON.stringify($scope.osInfo));
                    });
                    Socket.on("dbStatus", function (data) {
                        $scope.dbStatus = data;
                        console.log("got dbStatus: " + JSON.stringify($scope.dbStatus));
                    });
                    Socket.emit("database", "getStatus");
                    Socket.emit("os", {cmd: "getInfo"});
                    $scope.restartServer = function () {
                        if (!confirm(gettextCatalog.getString('Do you really want to restart the server?'))) {
                            return;
                        }
                        Socket.emit("os", {cmd: "restartServer"});
                    };
                    $scope.shutdown = function (reboot) {
                        if (!confirm(gettextCatalog.getString('Are you sure?'))) {
                            return;
                        }
                        if (!confirm(gettextCatalog.getString('REALLY REALLY SURE??????????'))) {
                            return;
                        }
                        var d = reboot ? "reboot" : "shutdown";
                        Socket.emit("os", {cmd: d});
                    };
                    $scope.restartWlan1 = function () {
                        Socket.emit("os", {
                            cmd: "restartwlan1",
                            param: {ssid: $scope.wlanId, passwd: $scope.wlanPasswd}
                        });
                    };
                    $scope.dbAction = function (action) {
                        if (!confirm(gettextCatalog.getString('Really DB: {{action}}?', {action: action}))) {
                            return;
                        }
                        Socket.emit("database", action);
                    };
                    $scope.requestServerInfo = function () {
                        Socket.emit("database", "getStatus");
                        Socket.emit("os", {cmd: "getInfo"});
                    };
                    $scope.printInterfaces = function (iname) {
                        if (typeof $scope.osInfo.interfaces === "undefined") {
                            return gettextCatalog.getString("N/A");
                        }
                        var interfaces = "";
                        Object.keys($scope.osInfo.interfaces).forEach(function (i, name) {
                            if (iname && i.indexOf(iname) === -1) {
                                return;
                            }
                            interfaces += i + ": ";
                            $scope.osInfo.interfaces[i].forEach(function (ver) {
                                interfaces += ver.address + " ";
                            });
                            interfaces += " - ";
                        });
                        return interfaces;
                    };
                }
            };
        })
        .directive('keypad', function() {
            return {
                restrict: 'E',
                scope: {
                    currency: "=",
                    submit: "&"
                },
                templateUrl: '/homevisit_components/views/keyboard.html',
                controller: function($scope, $element) {
                    var disp = $element.find('.disp');
                    $scope.enterNum = function(num) {
                        var newtext = disp.text() + num;
                        if (newtext.length < 10) {
                            disp.text(newtext);
                        }
                    };
                    $scope.bksp = function() {
                        var newtext = disp.text();
                        if (newtext.length > 0) {
                            disp.text(newtext.slice(0, -1));
                        }
                    };
                    $scope.accept = function() {
                        var v = disp.text();
                        if (v.length > 0) {
                            $scope.submit({number:v});
                        }
                    };
                }
            };
        });


})();
