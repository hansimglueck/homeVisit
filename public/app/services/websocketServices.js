/**
 * Created by jeanbluer on 06.02.15.
 */
angular.module('WebsocketServices', []).
    factory('Socket', function ($rootScope) {
        var ws;
        var role = 'master';
        var onMessageCallbacks;
        var registered = false;
        var host = location.host;
        onMessageCallbacks = [];

        var connect = function () {
            ws = new WebSocket('ws://' + host);
            ws.onconnect = function () {
                console.log("client connecting");
            };
            ws.onclose = function () {
                console.log("client lost connection");
                setTimeout(function () {
                    connect();
                }, 1000);
            };

            ws.onopen = function () {
                console.log("client: Socket has been opened!");
                onMessageCallbacks.push({
                    fn: function () {
                        registered = true;
                        console.log("registered");
                    },
                    eventName: "registerConfirm"
                });
                ws.send(JSON.stringify({type: "register", data: role}));
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