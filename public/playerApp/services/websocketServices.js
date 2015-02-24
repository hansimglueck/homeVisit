/**
 * Created by jeanbluer on 06.02.15.
 */
angular.module('WebsocketServices', []).
    factory('Socket', function ($rootScope, $cookies) {
        var sid = $cookies['connect.sid'];
        var ws;
        var onMessageCallbacks;
        var host = location.host;
        onMessageCallbacks = [];
        var connected = false;
        var server = {connected: connected};

        var connect = function () {
            ws = new WebSocket('ws://' + host);
            //ws.onconnect = function () {
            //    console.log("client: connecting");
            //};
            ws.onclose = function () {
                console.log("client lost connection");
                server.connected = false;
                $rootScope.$digest(); //damit das false auch ankommt...
                setTimeout(function () {
                    connect();
                }, 1000);
            };

            ws.onopen = function () {
                console.log("client: Socket has been opened!");
                server.connected = true;
                $rootScope.$digest(); //damit das true auch ankommt...
                ws.send(JSON.stringify({type: "register", data: {role:'player', sid:sid}}));

            };
            ws.onmessage = function (event) {
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
        };
        connect();
        return {
            server:server,
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