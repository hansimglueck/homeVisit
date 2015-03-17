var os = require('os');

function WsManager() {
    this.wss = {};
    this.clients = [];
    this.sids = [];
    this.roleCallbacks = [];

}

WsManager.prototype = {
    registerSID: function (sid) {
        if (this.sids.indexOf(sid) == -1) this.sids.push(sid);
    },
    onRole: function (role, self, callback) {
        this.roleCallbacks.push({
            fn: callback,
            role: role,
            self: self
        });
    },
    setSocketServer: function (wss) {
        this.wss = wss;
        var self = this;
        this.wss.on("connection", function (ws) {
            //oouch. die lokale variable clientId muss zu der .clientId des elements des client-array
            //in der dieser ws steckt passen

            console.info("websocket connection open");

            //var clientId;
            //clientId = g.clients.length;
            //g.clients.push({socket: ws, role: "undefined", clientId: clientId, connected: true});

            var responseDelay = 1000;
            var checkDelay = 2000;
            var lastPing = 0;
            var timeouts = 0;
            var maxTimeouts = 10;
            var waitingForPing = true;

            ws.pongg = function () {
                try {
                    if (ws.readyState != 1) {
                        console.log("pong: disconnected! stopping pingpong");
                        return;
                    }
                    //console.log("pong");
                    //console.log("pong: wss.clients.length: " + self.wss.clients.length);
                    //console.log("pong: ws.id=" + ws._ultron.id);
                    try {
                        ws.send("pong")
                    } catch (e) {
                        console.log("Error in PONG send!")
                    }
                    ;
                    waitingForPing = true;
                    var that = this;
                    setTimeout(function () {
                        that.checkPing()
                    }, checkDelay);
                } catch (e) {
                    console.log("pongg ERROR")
                }
            };

            ws.pingg = function () {
                try {
                    if (!waitingForPing) return;
                    waitingForPing = false;
                    //console.log("pong0: lastPong="+lastPong);
                    var d = new Date();
                    var now = d.getTime();
                    //console.log("ping: now-lastPing=" + (now - lastPing));
                    //console.log("ping: ws.id=" + ws._ultron.id);
                    lastPing = now;
                    timeouts = 0;
                    //console.log("pong1: lastPong="+lastPong);
                    var that = this;
                    setTimeout(function () {
                        that.pongg()
                    }, responseDelay);
                } catch (e) {
                    //console.log("pingg ERROR")
                }
            };

            ws.checkPing = function () {
                try {
                    //console.log("checkPong: lastPong="+lastPong);
                    var d = new Date();
                    var now = d.getTime();
                    if (now - lastPing > checkDelay) {
                        timeouts++;
                        //console.log("checkPing Timeout - " + (now - lastPing) + " timeouts=" + timeouts);
                        //console.log("ckeckPing ws.id=" + ws._ultron.id);
                        if (timeouts > maxTimeouts) {
                            //console.log("checkPing CLOSE!");
                            ws.close();
                            ws.cloosed(false);
                            return;
                        }
                        ws.pongg();
                    } //else console.log("checkPing: OK - " + (now - lastPing));
                    //console.log("checkPing ws.id=" + ws._ultron.id);
                } catch (e) {
                    console.log("checkPing ERROR")
                }
            };

            ws.cloosed = function (really) {
                try {
                    var clientId = ws.clientId;
                    var d = new Date();
                    var now = d.getTime();
                    console.log("closed: websocket connection closed " + (now - lastPing));
                    console.log("closed: ws.id=" + ws._ultron.id);
                    self.clients[clientId].connected = false;
                    self.applyRoleCallbacks(ws, {type: "disconnected"});
                    self.sendDeviceList();
                } catch (e) {
                    console.log("ERROR: " + e.message)
                }

            };

            ws.on("message", function (data) {
                if (data == "ping") {
                    ws.pingg();
                    return;
                }
                try {
                    var clientId = ws.clientId;

                    console.log("websocket received a message from " + clientId + ": " + (data));
                    //var msg = (typeof data == "Object") ? JSON.parse(data) : data;
                    var msg = JSON.parse(data);
                    //console.log(typeof data);

                    if (msg.type) {
                        switch (msg.type) {
                            case "register":
                                self.registerClient(msg, ws);
                                break;

                            case "forward":
                                self.forwardMessage(msg);
                                break;

                            case "forceReload":
                                //self.msgDevicesByRole(msg.data, "reload");
                                break;

                            case "getDeviceList":
                                //self.sendDeviceList();
                                break;

                            default:
                                console.log("unknown message-type");
                                break;

                        }
                        self.applyRoleCallbacks(ws, msg);
                    }

                } catch (err) {
                    console.log("ERRROR: " + err.stack);
                }
                //ws.send(JSON.stringify({msg:{connectionId:userId}}));
            });
            ws.on("error", function () {
                console.log("websocket error!");
            });

            ws.on("close", function () {
                console.log("ws.onClose!");
                ws.cloosed(true);
            });
        });
        console.log("websocket server created");

    },

    forwardMessage: function(msg) {
        var recipient;
        if (typeof msg.recipient != "undefined") recipient = msg.recipient;
        if (typeof msg.param != "undefined") recipient = msg.param;
        if (typeof recipient == "undefined") return;

        this.msgDevicesByRoleAndName(recipient.role, recipient.name, msg.data.type, msg.data.content);
    },

    applyRoleCallbacks: function (ws, msg) {
        this.roleCallbacks.forEach(function (cb) {
            if (cb.role == ws.role) {
                try {
                    cb.fn.call(cb.self, ws.clientId, msg);
                } catch (e) {
                    console.log("ERROR in wsManager.applyRoleCallback: " + e.stack);
                }
            }
        })
    },

    registerClient: function (msg, ws) {
        //var clientId;
        //clientId = g.clients.length;
        //g.clients.push({socket: ws, role: "undefined", clientId: clientId, connected: true});

        //ein client registriert sich mit msg.data = {type: "register", data: {role:'player', sid:sid}}
        //oder msg.data = {type: "register", data: role}
        //1.Fall: gucke, ob du sid schon kennst, dann entsprechend den client raussuchen und sid zurückschicken
        //  wenn nicht: sid generieren, in array stecken, und rausschicken
        //2.Fall: nix machen
        var dd = (typeof msg.data == "Object") ? JSON.parse(msg.data) : msg.data;
        var role = "unknown";
        var sid = "NN";
        var name = "NN";
        if (typeof dd == "string") role = dd;
        else {
            if (typeof dd.role != "undefined") role = dd.role;
            if (typeof dd.sid != "undefined") sid = dd.sid;
            if (typeof dd.name != "undefined") name = dd.name;
        }
        //console.log("ws-sid: " + sid);
        if (this.sids.indexOf(sid) == -1 && sid != "NN") {
            var hat = require('hat');
            sid = hat();
            this.registerSID(sid);
            //ws.send(JSON.stringify({type: "reload"}));
            //return;
        }
        //console.log(this.sids);
        //console.log("ws-sid: " + sid);
        var client;
        //schau mal, ob es schon einen client mit der sid gibt...
        //wenn ja: ws darein schreiben und den dazugehörigen player im data senden
        //wenn nicht: neuen client ins client-array pushen und für player neuen player anlegen und im data senden
        var prevClients = this.clients.filter(function (client) {
            if (client.sid == "NN" || client.sid == "unknown") return false;
            return (sid == client.sid);
        });
        //es sollte nur max einen geben
        if (prevClients.length > 0) {
            client = prevClients[0];
            //es gibt schon einen client mit dieser sid
            client.socket = ws;
            //g.clients.splice(clientId, 1);
            //clientId = prevClients[0].clientId;
            client.connected = true;
        } else {
            //first time registered
            var clientId = this.clients.length;
            client = {socket: ws, role: role, clientId: clientId, connected: true, sid: sid, name: name};
            this.clients.push(client);
        }
        ws.clientId = client.clientId;

        //g.clients[clientId].role = role;
        //g.clients[clientId].sid = sid;
        ws.send(JSON.stringify({type: "registerConfirm", data: client.clientId, sid: sid}));
        ws.role = role;
//        ws.send(JSON.stringify({type: "registerConfirm", data: {playerId: player.playerId, colors: player.colors}}));
        //if (role == 'player') ws.send(JSON.stringify({type:'rates', data: g.avgRating}));
        this.sendDeviceList();
        if (role == "master") {
            this.sendOsInfo(ws);
        }
    },

    msgDevicesByRoleAndName: function(role, name, type, message) {
        this.clients.forEach(function each(client) {
            if (client.role == role && client.connected && client.name == name) {
                client.socket.send(JSON.stringify({type: type, data: message}));
            }
        });
    },
    msgDevicesByRole: function (role, type, message) {
        if (role === "player" && type == "vote" || type == "card") this.lastPlayerMessage = message;
        var self = this;
        this.clients.forEach(function each(client) {
            if (client.role == role && client.connected) {
                client.socket.send(JSON.stringify({type: type, data: message}));
                //self.log(-1, "sent to client " + client.clientId + ":" + JSON.stringify({type: type, data: message}))
            }
        });
    },

    msgDeviceByIds: function (ids, type, message) {
        var self = this;
        ids.forEach(function (id) {
            var clientsWithId = self.clients.filter(function (c) {
                if (c.connected == false) return false;
                return (c.clientId == id);
            });
            //es dürfte nur einen geben...
            if (clientsWithId.length > 0) clientsWithId[0].socket.send(JSON.stringify({type: type, data: message}));
        });
    },

    sendDeviceList: function () {
        var list = [];
        for (var i = 0; i < this.clients.length; i++) {
            if (this.clients[i].connected) list.push({id: i, role: this.clients[i].role});
        }
        this.clients.forEach(function (client) {
            if (client.role == "master" && client.connected) client.socket.send(JSON.stringify({
                type: "DeviceList",
                data: list
            }));
        });
    },
    sendOsInfo: function (ws) {
        var info = {
            hostname: os.hostname(),
            type: os.type(),
            arch: os.arch(),
            uptime: os.uptime(),
            loadavg: os.loadavg(),
            totalmem: os.totalmem(),
            freemem: os.freemem(),
            interfaces: os.networkInterfaces()
        };
        ws.send(JSON.stringify({type: "osinfo", data: info}));
    }
};

module.exports = new WsManager();