/**
 * Created by jeanbluer on 26.01.15.
 */
var exec = require('child_process').exec;
var os = require('os');

function Game() {
    this.play = false;
    this.deckId = 0;
    this.stepId = 0;
    this.decks = [];
    this.wss = {};
    this.clients = [];
    this.conf = {};
    this.players = [];
    this.colors = [
        ["rot", "gelb"],
        ["rot", "blau"],
        ["rot", "weiss"],
        ["rot", "gruen"],
        ["rot", "pink"],
        ["gelb", "blau"],
        ["gelb", "weiss"],
        ["gelb", "gruen"],
        ["gelb", "pink"],
        ["blau", "weiss"],
        ["blau", "gruen"],
        ["blau", "pink"],
        ["weiss", "gruen"],
        ["weiss", "pink"],
        ["pink", "grün"],
        ["pink", "schwarz"]
    ];
    this.rating = [];
    this.avgRating = [];
}

Game.prototype = {

    initDb: function () {
        var g = this;
        var gConf = require('../models/GameConf.js');
        gConf.findOne({role: 'run'}, function (err, conf) {
            g.conf = conf;
            if (conf == null) g.conf = {role: 'run', startDeckId: 0, autostart: false, playerCnt: 1, typeMapping: []};
            console.log("autostart=" + g.conf.autostart);
        });

    },

    setSocketServer: function (wss) {
        this.wss = wss;
        var g = this;
        this.wss.on("connection", function (ws) {
            //oouch. die lokale variable clientId muss zu der .clientId des elements des client-array
            //in der dieser ws steckt passen

            console.info("websocket connection open");

            //var clientId;
            //clientId = g.clients.length;
            //g.clients.push({socket: ws, role: "undefined", clientId: clientId, connected: true});

            ws.on("message", function (data) {
                try {
                    var clientId = ws.clientId;
                    g.wss.clients.forEach(function each(client) {
                        console.log("wss-client: " + client);
                    });

                    console.log("websocket received a message from " + clientId + ": " + (data));
                    //var msg = (typeof data == "Object") ? JSON.parse(data) : data;
                    var msg = JSON.parse(data);
                    console.log(typeof data);
                    if (msg.type) {
                        switch (msg.type) {
                            case "register":
                                g.registerClient(msg, ws);
                                break;

                            case "os":
                                switch (msg.data) {
                                    case "shutdown":
                                        exec("sudo shutdown -h now", function (error, stdout, stderr) {
                                            console.log("exec1")
                                        });
                                        //exec("android", function (error, stdout, stderr) {console.log("exec1")});
                                        break;
                                    case "getInfo":
                                        g.sendOsInfo(ws);
                                        break;
                                }
                                break;

                            case "playbackAction":
                                g.trigger(clientId, msg.data);
                                break;

                            case "getDeviceList":
                                g.sendDeviceList();
                                break;

                            case "vote":
                                g.vote(clientId, msg);
                                break;

                            case "rate":
                                g.rate(clientId, msg.data);
                                break;

                            default:
                                console.log("unknown message-type");
                                break;

                        }
                    }
                }catch(err){
                    console.log(err.message);
                }
                //ws.send(JSON.stringify({msg:{connectionId:userId}}));
            });

            ws.on("close", function () {
                var clientId = ws.clientId;
                console.log("websocket connection close");
                g.clients[clientId].connected = false;
                g.sendDeviceList();
            });
        });
        console.log("websocket server created");

    },

    registerClient: function(msg, ws) {
        //var clientId;
        //clientId = g.clients.length;
        //g.clients.push({socket: ws, role: "undefined", clientId: clientId, connected: true});

        //ein client registriert sich mit msg.data = {type: "register", data: {role:'player', sid:sid}}
        //oder msg.data = {type: "register", data: role}
        var dd = (typeof msg.data == "Object") ? JSON.parse(msg.data) : msg.data;
        var role = "unknown";
        var sid = "unknown";
        if (typeof dd == "string") role = dd;
        else {
            if (typeof dd.role != "undefined") role = dd.role;
            if (typeof dd.sid != "undefined") sid = dd.sid;
        }
        var client;
        //schau mal, ob es schon einen client mit der sid gibt...
        //wenn ja: ws darein schreiben und den dazugehörigen player im data senden
        //wenn nicht: neuen client ins client-array pushen und für player neuen player anlegen und im data senden
        var prevClients = this.clients.filter(function (client) {
            if (client.sid == "unknown") return false;
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
            client = {socket: ws, role: role, clientId: clientId, connected: true, sid: sid};
            this.clients.push(client);
        }
        ws.clientId = client.clientId;

        var player = {};        //der player, der zu diesem client gehört.
        if (role == "player") {
            //schau mal, ob es einen player gibt, der über diesen client gespielt hat
            //wen ja, sende diesen player
            //wenn nicht, schaue, ob noch ein platz frei ist und vergebe ihn
            player = this.players.filter(function (pl) {
                return (pl.client.clientId == client.clientId);
            })[0];
            if (typeof player == "undefined") {
                //lege neuen player an, falls noch ein platz frei ist
                player = this.seatPlayer();
                if (typeof player != "undefined") player.client = client;
                else {
                    ws.send(JSON.stringify({type: "registerConfirm", data: {playerId:-1}}));
                    ws.close();
                    client.connected = false;
                    return;
                }
            }
        }
        //g.clients[clientId].role = role;
        //g.clients[clientId].sid = sid;
        ws.send(JSON.stringify({type: "registerConfirm", data: {playerId: player.playerId, colors: player.colors}}));
        if (!!this.lastPlayerMessage && role == 'player') ws.send(JSON.stringify({
            type: "display",
            data: this.lastPlayerMessage
        }));
        //if (role == 'player') ws.send(JSON.stringify({type:'rates', data: g.avgRating}));
        this.sendDeviceList();
        this.sendOsInfo(ws);

    },

    seatPlayer: function() {
        //find available playerId:
        //1. look for empty players
        //2. check if there are disconnected players
        var player;
        var playerId = -1;
        for (var i = this.conf.playerCnt - 1; i >= 0; i--) {
            if (typeof this.players[i] == 'undefined') playerId = i;
        }
        if (playerId == -1) {
            for (var i = this.conf.playerCnt - 1; i >= 0; i--) {
                if (typeof this.players[i] != 'undefined') {
                    if (!this.players[i].client.connected) playerId = i;
                }
            }
        }
        if (playerId != -1 && playerId<16) {
            player = {
                clientId: -1,
                playerId: playerId,
                colors: this.colors[playerId]
            };
            this.players[playerId] = player;
        }
        return player;
    },

    rate: function (clientId, data) {
        var playerId = data.playerId;
        var rate = data.rate;
        this.rating[playerId] = rate;
        console.log("rate: " + this.rating);
        this.calcAvgRate();
        this.msgDevicesByRole('player', 'rates', {avgRating: this.avgRating});
    },

    calcAvgRate: function () {
        var sum;
        for (var j = 0; j < this.rating.length; j++) {
            sum = 0;
            for (var i = 0; i < this.rating.length; i++) {
                sum += this.rating[i][j];
            }
            this.avgRating[j] = Math.round(sum / this.conf.playerCnt);
        }
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

    trigger: function (sid, msg) {
        console.log("game.trigger: " + sid + ", " + msg);
        switch (msg) {
            case "play":
                console.log('play');
                this.start(sid);
                break;

            case "stop":
                this.stop(sid);
                break;

            case "go":
                console.log('go');
                this.step(sid);
                break;

            case "rego":
                console.log('rego');
                this.step(sid, this.stepId);
                break;

            case "back":
                console.log('back');
                var id = this.stepId;
                if (id > 0) id--;
                this.step(sid, id);
                break;

            default:
                this.log("game received unknown command: " + msg);
        }
    },

    log: function (sid, message) {
        message = "Client " + sid + " - " + message;
        this.clients.forEach(function each(client) {
            if (client.role == "master" && client.connected) client.socket.send(JSON.stringify({
                type: "log",
                data: message
            }));
        });
        console.log("gesendet");
    },

    step: function (sid, id) {
        var msg = "";

        //autostart or deny
        if (this.play == false) {
            if (this.conf.autostart) {
                this.start(sid);
                return;
            }
            else msg += "we are not playing!";
            this.log(sid, msg);
            return;
        }

        //step one up or to a specific step-nr
        this.stepId = (typeof id !== 'undefined') ? id : this.stepId += 1;

        //restart at step 0 when at the end
        if (this.stepId >= this.decks[this.deckId].items.length) {
            this.stepId = 0;
            msg += ": no more items - ";
        }

        //objekt mit den relevanten daten zum senden vorbereiten
        var content = {
            type: this.getItem().type,
            text: this.getItem().text,
            voteOptions: this.getItem().voteOptions,
            voteMulti: this.getItem().voteMulti
        };

        //die eingehenden votes werden in einem objekt des aktuellen items gespeichert
        if (content.type == "vote") this.getItem().votes = {};

        //log-nachricht
        msg += " stepped to " + this.stepId + " (" + content.type + ")";
        this.log(sid, msg, content);

        var wait = parseInt(this.getItem().wait) * 1000;
        if (typeof wait === 'undefinded') wait = 0;
        var self = this;
        setTimeout(function () {
            self.executeStep.call(self, sid, content)
        }, wait);
    },

    executeStep: function (sid, content) {

        //an die konfigurierten default-devices senden
        var map = this.conf.typeMapping.filter(function (tm) {
            return (tm.type == content.type);
        })[0];
        if (map.devices.length == 0) this.log(sid, "keine Devices gefunden für " + content.type);
        var self = this;
        map.devices.forEach(function (dev) {
            self.msgDevicesByRole(dev, "display", content);
        });
        self.msgDevicesByRole('master', 'status', {stepId: self.stepId, type: self.getItem().type});

        //checken, wie der nächste step getriggert wird
        if (this.stepId + 1 < this.decks[this.deckId].items.length) {
            if (this.decks[this.deckId].items[this.stepId + 1].trigger == "follow") {
                this.step(sid);
            }
        }
    },

    msgDevicesByRole: function (role, type, message) {
        if (role === "player" && type == "vote" || type =="card") this.lastPlayerMessage = message;
        var self = this;
        this.clients.forEach(function each(client) {
            if (client.role == role && client.connected) {
                client.socket.send(JSON.stringify({type: type, data: message}));
                self.log(-1, "sent to client " + client.clientId + ":" + JSON.stringify({type: type, data: message}))
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

    start: function (sid) {
        console.log(this.conf);
        if (this.play == false) {
            var g = this;
            var Deck = require('../models/Deck.js');
            for (var i = 0; i < this.conf.playerCnt; i++) {
                this.rating[i] = [];
                for (var j = 0; j < this.conf.playerCnt; j++) {
                    this.rating[i][j] = 4;
                }
            }
            this.calcAvgRate();

            Deck.find(function (err, decks) {
                if (err) return next(err);
                g.decks = decks;
                g.decks.forEach(function (deck, id) {
                    console.log(deck._id);
                    console.log(g.conf.startDeckId);
                    if (String(deck._id) == String(g.conf.startDeckId)) g.deckId = id;
                    console.log(String(deck._id) == String(g.conf.startDeckId));
                });
                //console.log(g.decks);
                g.step(sid, 0);
            });
            this.play = true;
            this.log(sid, "client" + sid + " started game");
            this.msgDevicesByRole('player', 'rates', {avgRating: this.avgRating});
        } else {
            this.log(sid, "client" + sid + " already playing");
        }
    },

    stop: function (sid) {
        this.play = false;
        //this.players = {};
        this.stepId = 0;
        this.log(sid, "client" + sid + " stopped game");
    },

    vote: function (sid, data) {
        var pid = data.playerId;
        data = data.data;
        if (this.decks[this.deckId].items[this.stepId].type != "vote") {
            this.msgDeviceByIds([sid], "display", {"text": "There is no vote at the moment!"});
            return;
        }
        if (this.getItem().votes[sid]) {
            this.msgDeviceByIds([sid], "display", {"text": "You already voted in this Poll!"});
        }
        console.log("vote=" + data);
        var msg = "You voted: ";
        for (var i = 0; i < data.length; i++) {
            if (data[i].checked) msg += data[i].text + " ";
            this.getItem().votes[sid] = data;
            this.getItem().votes[sid].multiplier = this.avgRating[pid];
        }
        this.log(sid, msg);
        this.msgDeviceByIds([sid], "display", {"text": msg});
        if (Object.keys(this.getItem().votes).length >= this.conf.playerCnt) this.voteComplete();
    },

    voteComplete: function () {
        var votes = this.getItem().votes;
        var voteOptions = this.getItem().voteOptions;
        var voteCount = 0;
        var bestOption = 0;
        Object.keys(votes).forEach(function (v) {
            for (var i = 0; i < voteOptions.length; i++) {
                if (!voteOptions[i].result) voteOptions[i].result = 0;
                if (votes[v][i].checked) {
                    voteCount++;
                    voteOptions[i].result += votes[v].multiplier;
                    if (voteOptions[i].result > voteOptions[bestOption].result) bestOption = i;
                }
            }
        });
        voteOptions.sort(function (a, b) {
            return b.result - a.result
        });
        var msg = "RESULTS::-----------------::";
        var labels = [];
        var resData = [];
        this.getItem().voteOptions.forEach(function (option) {
            msg += option.text + ": " + (option.result / voteCount * 100).toFixed(1) + "% (" + option.result + "/" + voteCount + ")" + "::";
            labels.push(option.text + ": " + (option.result / voteCount * 100).toFixed(1) + "%");
            resData.push(option.result / voteCount * 100);
        });
        this.msgDevicesByRole('player', "display", {type: "result", text: msg, labels: labels, data: resData});
    },

    getItem: function () {
        return this.decks[this.deckId].items[this.stepId];
    }

};

var gameObj = new Game();

module.exports = gameObj;