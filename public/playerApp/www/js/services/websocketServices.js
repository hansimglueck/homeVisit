/**
 * Created by jeanbluer on 06.02.15.
 */
angular.module('WebsocketServices', []).
    factory('Socket', function ($rootScope, $cookies) {
        var sid = "x";
        //var sid = $cookies['connect.sid'].split(":")[1].split(".")[0];
        var ws;
        var onMessageCallbacks;
        //var host = location.host;
        var host = "home.visit.eu";
        onMessageCallbacks = [];
        var connected = false;
        var server = {connected: connected};

        var responseDelay = 1000;
        var checkDelay = 2000;
        var lastPong = 0;
        var timeouts = 0;
        var maxTimeouts = 10;
        var waitingForPong = false;

        var ping = function () {
            if (!server.connected) {
                console.log("ping: disconnected! stopping pingpong");
                return;
            }
            console.log("ping");
            try {ws.send("ping");}catch(e){console.log("ws.sed ERRROR!");}
            waitingForPong = true;
            setTimeout(function() {checkPong($rootScope)}, checkDelay);
        };

        var pong = function() {
            if (!waitingForPong) return;
            waitingForPong = false;
            //console.log("pong0: lastPong="+lastPong);
            var d = new Date();
            var now = d.getTime();
            console.log("pong: now-lastPong="+(now-lastPong));
            lastPong = now;
            timeouts = 0;
            //console.log("pong1: lastPong="+lastPong);
            setTimeout(function(){ping()}, responseDelay);
        };

        var checkPong = function(scope) {
            //console.log("checkPong: lastPong="+lastPong);
            var d = new Date();
            var now = d.getTime();
            if (now - lastPong > checkDelay) {
                timeouts++;
                console.log("checkPong Timeout - "+(now - lastPong)+" timeouts="+timeouts);
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
                console.log("checkPong: OK - "+(now - lastPong));
            }
        };



        var closed = function(really) {
            var d = new Date();
            var now = d.getTime();
            console.log("client lost connection "+(now-lastPong));
            server.connected = false;
            $rootScope.$digest(); //damit das false auch ankommt...
            $rootScope.$broadcast("disconnected");
            if (really) setTimeout(function () {
                connect();
            }, 1000);
        };

        var connect = function () {
            console.log("trying new ws!");
            ws = new WebSocket('ws://' + host);
            //ws.onconnect = function () {
            //    console.log("client: connecting");
            //};
            ws.onclose = function () {
                console.log("ws.onclose!!");
                closed(true);
            };

            ws.onopen = function () {
                console.log("client: Socket has been opened!");
                server.connected = true;
                $rootScope.$digest(); //damit das true auch ankommt...
                ws.send(JSON.stringify({type: "register", data: {role:'player', sid:sid}}));
                onMessageCallbacks.push({
                    fn: function (event) {
                        var data = JSON.parse(event.data).sid;
                        if (typeof sid != "undefined") sid = data;
                        console.log("registerConfirm got sid: "+sid)
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
                //return pingTime;
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