/**
 * Created by jeanbluer on 26.01.15.
 */

function Game() {
    this.play = false;
    this.deckId = 0;
    this.stepId = 0;
    this.decks = [];
    this.wss = {};
    this.clients = [];
    this.conf = {};
}

Game.prototype = {

    initDb: function(){
        var g = this;
        var gConf = require('../models/GameConf.js');
        gConf.findOne({role:'run'}, function (err, conf) {
            g.conf = conf;
            if (typeof g.conf.role == "undefined") g.conf = {role:'run', startDeckId:0, autostart:false, playerCnt:1, typeMapping:[]};
            console.log("autostart="+g.conf.autostart);
        });

    },

    setSocketServer: function(wss) {
        this.wss = wss;
        var g = this;
        this.wss.on("connection", function (ws) {

            console.info("websocket connection open");

            var clientId;
            clientId = g.clients.length;
            g.clients.push({socket: ws, role: "undefined"});

            ws.on("message", function (data) {
                g.wss.clients.forEach(function each(client) {
                    console.log("wss-client: "+client);
                });

                console.log("websocket received a message from "+clientId+": "+(data));
                var msg = JSON.parse(data);
                if (msg.type){
                    switch(msg.type) {
                        case "register":
                            g.clients[clientId].role = msg.data;
                            ws.role=msg.data;
                            ws.send(JSON.stringify({type:"registerConfirm"}));
                            if (!!g.lastPlayerMessage) ws.send(JSON.stringify({type: "display", data: g.lastPlayerMessage}));
                            g.sendDeviceList();
                            break;

                        case "playbackAction":
                            g.trigger(clientId, msg.data);
                            break;

                        case "getDeviceList":
                            g.sendDeviceList();
                            break;

                        case "vote":
                            g.vote(clientId, msg.data);
                            break;

                        default:
                            console.log("unknown message-type");
                            break;

                    }
                }

                //ws.send(JSON.stringify({msg:{connectionId:userId}}));


            });

            ws.on("close", function () {
                console.log("websocket connection close");
                delete g.clients[clientId];
                g.sendDeviceList();
            });
        });
        console.log("websocket server created");

    },

    sendDeviceList: function() {
        var list = [];
        for (var i = 0; i < this.clients.length; i++) {
            if (this.clients[i]) list.push({id: i, role:this.clients[i].role });
        }
        this.clients.forEach(function each(client) {
            if (client.role =="master") client.socket.send(JSON.stringify({type:"DeviceList", data: list}));
        });
    },

    trigger: function(sid, msg) {
        console.log("game.trigger: "+sid+", "+msg);
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
                this.log("game received unknown command: "+msg);
        }
    },

    log: function(sid, message) {
        message = "Client "+sid+" - "+message;
        this.clients.forEach(function each(client) {
            if (client.role =="master") client.socket.send(JSON.stringify({type: "log", data: message}));
        });
        console.log("gesendet");
    },

    step: function(sid, id) {
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
        if (content.type == "vote") this.getItem().votes={};

        //log-nachricht
        msg += " stepped to "+this.stepId +" ("+content.type+")";
        this.log(sid, msg, content);

        var wait = parseInt(this.getItem().wait)*1000;
        if (typeof wait === 'undefinded') wait = 0;
        var self = this;
        setTimeout(function() {self.executeStep.call(self, sid, content)}, wait);
    },

    executeStep : function(sid, content) {

        //an die konfigurierten default-devices senden
        var map = this.conf.typeMapping.filter(function(tm) {
            return (tm.type == content.type);
        })[0];
        if (map.devices.length == 0) this.log(sid, "keine Devices gefunden für "+content.type);
        var self = this;
        map.devices.forEach(function(dev){
            self.msgDevicesByRole(dev, "display", content);
        });

        //checken, wie der nächste step getriggert wird
        if (this.stepId+1 < this.decks[this.deckId].items.length) {
            if (this.decks[this.deckId].items[this.stepId+1].trigger == "follow") {
                this.step(sid);
            }
        }
    },

    msgDevicesByRole: function(role, type, message) {
        if (role==="player") this.lastPlayerMessage = message;
        this.clients.forEach(function each(client) {
            if (client.role ==role) client.socket.send(JSON.stringify({type: type, data: message}));
        });
    },

    msgDeviceByIds: function(ids, type, message) {
        var self = this;
        ids.forEach(function(id){
            self.clients[id].socket.send(JSON.stringify({type: type, data: message}));
        });
    },

    start: function(sid) {
        console.log(this.conf);
        if (this.play == false) {
            var g = this;
            var Deck = require('../models/Deck.js');
            Deck.find(function (err, decks) {
                if (err) return next(err);
                g.decks = decks;
                g.decks.forEach(function (deck, id) {
                    console.log(deck._id);
                    console.log(g.conf.startDeckId);
                    if(String(deck._id) == String(g.conf.startDeckId)) g.deckId = id;
                    console.log(String(deck._id) == String(g.conf.startDeckId));
                });
                //console.log(g.decks);
                g.step(sid, 0);
            });
            this.play = true;
            this.log(sid, "client"+sid+" started game");
        } else {
            this.log(sid, "client"+sid+" already playing");
        }
    },

    stop: function(sid) {
        this.play = false;
        //this.players = {};
        this.stepId = 0;
        this.log(sid, "client"+sid+" stopped game");
    },

    vote: function(sid, data) {
        if (this.decks[this.deckId].items[this.stepId].type != "vote") {
            this.msgDeviceByIds([sid], "display", {"text":"There is no vote at the moment!"});
            return;
        }
        if (this.getItem().votes[sid]) {
            this.msgDeviceByIds([sid], "display", {"text":"You already voted in this Poll!"});
        }
        console.log("vote=" + data);
        var msg = "You voted: ";
        for (var i = 0; i < data.length; i++) {
            if (data[i].checked) msg += data[i].text + " ";
            this.getItem().votes[sid] = data;
        }
        this.log(sid, msg);
        this.msgDeviceByIds([sid], "display", {"text":msg});
        if (Object.keys(this.getItem().votes).length >= this.conf.playerCnt) this.voteComplete();
    },

    voteComplete: function() {
        var votes = this.getItem().votes;
        var voteOptions = this.getItem().voteOptions;
        var voteCount = 0;
        var bestOption = 0;
        Object.keys(votes).forEach(function(v){
            for (var i = 0; i < voteOptions.length; i++) {
                if (!voteOptions[i].result) voteOptions[i].result = 0;
                if (votes[v][i].checked) {
                    voteCount++;
                    voteOptions[i].result+=1;
                    if (voteOptions[i].result > voteOptions[bestOption].result) bestOption = i;
                }
            }
        });
        voteOptions.sort(function(a,b) {return b.result - a.result});
        var msg="RESULTS::-----------------::";
        var labels = [];
        var resData = [];
        this.getItem().voteOptions.forEach(function(option){
            msg += option.text + ": " + (option.result/voteCount*100).toFixed(1) + "% ("+option.result+"/"+voteCount+")"+ "::";
            labels.push(option.text + ": " + (option.result/voteCount*100).toFixed(1) + "%");
            resData.push(option.result/voteCount*100);
        });
        this.msgDevicesByRole('player', "display",  {type:"result", text:msg, labels: labels, data: resData});
    },

    getItem: function() {
        return this.decks[this.deckId].items[this.stepId];
    }

};

var gameObj= new Game();

module.exports = gameObj;