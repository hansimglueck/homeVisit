/**
 * Created by jeanbluer on 06.02.15.
 */
angular.module('WebsocketServices', []).
    factory('Socket', function ($rootScope, $cookies) {
        var sid = $cookies['connect.sid'].split(":")[1].split(".")[0];
        var ws;
        var onMessageCallbacks;
        var host = location.host;
        onMessageCallbacks = [];
        var connected = false;
        var server = {connected: connected};
        var pingTime = 0;
        var pingCount = 0;
        var pingTimeouts = 0;

        var ping = function() {
            if (pingCount > 0) {
                pingTimeouts++;
                //pingCount = 0;
                $rootScope.$broadcast("pingpong", 2222, pingCount, pingTimeouts);
                if (pingTimeouts > 1) {
                    ws.close();
                    closed();
                }
            }
            var d = new Date();
            pingTime = d.getMilliseconds();
            ws.send("ping");
            pingCount++;
            setTimeout(function(){ping()}, 2000);
        };
        var pong = function() {
            var d = new Date();
            //console.log("pong: "+(d.getMilliseconds()-pingTime));
            pingCount--;
            $rootScope.$broadcast("pingpong", (d.getMilliseconds()-pingTime), pingCount, pingTimeouts);
        };

        var closed = function() {
            console.log("client lost connection");
            server.connected = false;
            $rootScope.$digest(); //damit das false auch ankommt...
            $rootScope.$broadcast("disconnected");
            setTimeout(function () {
                connect();
            }, 1000);
        };

        var connect = function () {
            ws = new WebSocket('ws://' + host);
            //ws.onconnect = function () {
            //    console.log("client: connecting");
            //};
            ws.onclose = function () {
                closed();
            };

            ws.onopen = function () {
                console.log("client: Socket has been opened!");
                server.connected = true;
                $rootScope.$digest(); //damit das true auch ankommt...
                ws.send(JSON.stringify({type: "register", data: {role:'player', sid:sid}}));
                ping();
            };

            ws.onmessage = function (event) {
                if (event.data == "pong") {
                    pong();
                    return;
                }
                console.log('onmessage: ' + event.data);
                var message = JSON.parse(event.data);
                var args = arguments;
                var eventName;
                var currentCallback;
                for (var i = 0; i < onMessageCallbacks.length; i++) {
                    currentCallback = onMessageCallbacks[i];
                    eventName = currentCallback.eventName;
                    if (eventName) {
                        if (angular.isString(eventName) && message.type === eventName) {
                            $rootScope.$apply(function () {
                                currentCallback.fn.apply(ws, args);
                            });
                        }
                    }
                }
            };
            ws.onerror = function(event) {
                console.log("WS_ERROR!!!");
                console.log(event);
            };
        };
        connect();
        return {

            server:server,
            getPingPong: function() {
                return pingTime;
            },
            connected: function() {
                return connected;
            },

            connect: function() {connect()},

            on: function (eventName, callback) {
                onMessageCallbacks.push({
                    fn: callback,
                    eventName: eventName
                });
            },
            emit: function (data) {
                var msg = typeof(data) == "object" ? JSON.stringify(data) : data;
                console.log("emit " + msg);
                ws.send(msg);
            }
        }

    });