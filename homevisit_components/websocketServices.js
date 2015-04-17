/**
 * Created by jeanbluer on 06.02.15.
 */
angular.module('WebsocketServices', []).
    factory('Socket', function ($rootScope, $timeout) {
        var sid = "x";
        var ws;
        var onMessageCallbacks;
        //TODO: switch by type cordova/webapp
        var host = location.host;
        //var host = "home.visit.eu";
        onMessageCallbacks = [];
        var registered = false;
        var connected = false;
        var server = {connected: connected};
        var started = false;

        var responseDelay = 1000;
        var checkDelay = 2000;
        var lastPong = 0;
        var timeouts = 0;
        var maxTimeouts = 10;
        var waitingForPong = false;
        var role = "NN";

        var setRole = function(val) {
            role = val;
        };

        var ping = function () {
            if (!server.connected) {
                //console.log("ping: disconnected! stopping pingpong");
                return;
            }
            //console.log("ping");
            try {
                ws.send("ping");
            } catch (e) {
                console.log("ws.sed ERRROR!");
            }
            waitingForPong = true;
            setTimeout(function () {
                checkPong($rootScope)
            }, checkDelay);
        };
        var pong = function () {
            if (!waitingForPong) return;
            waitingForPong = false;
            var d = new Date();
            var now = d.getTime();
            //console.log("pong: now-lastPong="+(now-lastPong));
            lastPong = now;
            timeouts = 0;
            setTimeout(function () {
                ping()
            }, responseDelay);
        };
        var checkPong = function (scope) {
            //console.log("checkPong: lastPong="+lastPong);
            var d = new Date();
            var now = d.getTime();
            if (now - lastPong > checkDelay) {
                timeouts++;
                //console.log("checkPong Timeout - "+(now - lastPong)+" timeouts="+timeouts);
                scope.$broadcast("pingpong", (now - lastPong), timeouts);
                if (timeouts > maxTimeouts) {
                    console.log("CLOSE!");
                    ws.close();
                    closed(false);
                    return;
                }
                ping();
            } else {
                scope.$broadcast("pingpong", (now - lastPong), timeouts);
                //console.log("checkPong: OK - "+(now - lastPong));
            }
        };

        var closed = function (really) {
            var d = new Date();
            var now = d.getTime();
            console.log("client lost connection " + (now - lastPong));
            server.connected = false;
            $rootScope.$digest(); //damit das false auch ankommt...
            $rootScope.$broadcast("disconnected");
            if (really) $timeout(function () {
                started = false;
                connect();
            }, 1000);
        };

        var connect = function () {
            if (started) return;
            started = true;
            console.log("trying new ws!");
            ws = new WebSocket('ws://' + host);
            ws.onclose = function () {
                console.log("ws.onclose!!");
                closed(true);
            };
            ws.onopen = function () {
                console.log("client: Socket has been opened!");
                server.connected = true;
                $rootScope.$digest(); //damit das true auch ankommt...
                ws.send(JSON.stringify({type: "register", data: {role: role, sid: sid}}));
                onMessageCallbacks.push({
                    fn: function (data) {
                        connected = true;
                        registered = true;
                        var newSid = data.sid;
                        if (typeof newSid != "undefined") sid = newSid;
                        console.log("registerConfirm got sid: " + sid)
                    },
                    eventName: "registerConfirm"
                });
                ping();
            };

            ws.onmessage = function (event) {
                if (event.data == "pong") {
                    pong();
                    return;
                }
                console.log('onmessage: ' + event.data);
                var message = JSON.parse(event.data);
                var eventName;
                var currentCallback;
                for (var i = 0; i < onMessageCallbacks.length; i++) {
                    currentCallback = onMessageCallbacks[i];
                    eventName = currentCallback.eventName;
                    if (eventName) {
                        if (angular.isString(eventName) && message.type === eventName) {
                            $rootScope.$apply(function () {
                                currentCallback.fn.call(ws, message.data);
                            });
                        }
                    }
                }
            };
            ws.onerror = function (event) {
                console.log("WS_ERROR!!!");
                console.log(event);
            };
        };
        return {

            server: server,
            getPingPong: function () {
                //return pingTime;
            },
            connected: function () {
                return connected;
            },

            connect: function (role) {
                setRole(role);
                connect()
            },

            on: function (eventName, callback) {
                console.log("Socket registers callback for "+eventName);
                onMessageCallbacks.push({
                    fn: callback,
                    eventName: eventName
                });
            },
            emit: function (type, data) {
                //var msg = typeof(data) == "object" ? JSON.stringify(data) : data;
                console.log("emit " + JSON.stringify({type: type, data: data}));
                ws.send(JSON.stringify({type: type, data: data}));
            }
        }

    });
