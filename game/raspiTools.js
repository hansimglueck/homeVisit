(function () {
    'use strict';

    var exec = require('child_process').exec;
    var os = require('os');
    var isOnline = require('is-online');
    var MongoClient = require('mongodb').MongoClient;
    var mongoUri = require('../homevisitConf').mongoUri;
    var wsManager = require('./wsManager.js');
    var conf = require('../homevisitConf');

    function RaspiTools() {
        this.onlineTasks = [];
        this.onlineState = false;
        this.infoSubscribers = [];
    }

    RaspiTools.prototype = {
        addOnlineTask: function (that, task, interval) {
            var id = this.onlineTasks.push({context: that, interval: interval, task: task, intervalObject: null});
            if (this.onlineState) {
                this.executeOnlineTask(id);
            }
        },
        startOnlineObservation: function (interval) {
            var self = this;
            setInterval(function () {
                self.onlineObservation()
            }, interval);
        },
        onlineObservation: function () {
            var self = this;
            isOnline(function (err, online) {
                if (online !== self.onlineState) {
                    self.onlineState = online;
                    console.log("New onlineState: " + self.onlineState);
                    wsManager.msgDevicesByRole("printer", "display", {type: "card", text: online ? "Online" : "Offline"});
                    self.sendOsInfo();
                    self.onlineTasks.forEach(function (task, id) {
                        self.stopOnlineTask(id);
                        if (online) self.executeOnlineTask(id);
                    });
                }
             })
        },
        executeOnlineTask: function (id) {
            var task = this.onlineTasks[id];
            this.stopOnlineTask(id);
            task.task.call(task.context);
            if (task.interval !== 0) {
                task.intervalObject = setInterval(function () {
                    console.log("starting task "+id);
                    task.task.call(task.context);
                }, task.interval);
            }
        },
        stopOnlineTask: function (id) {
            var task = this.onlineTasks[id];
            if (task.intervalObject !== null) {
                clearInterval(task.intervalObject);
            }
        },
        addInfoSubscriber: function (clientId) {
            clientId = parseInt(clientId);
            if (this.infoSubscribers.indexOf(clientId) === -1) {
                this.infoSubscribers.push(clientId);
            }
        },
        newMessage: function (clientId, role, msg) {
            if (typeof msg !== "undefined") {
                try {
                    switch (msg.type) {
                        case "os":
                            switch (msg.data.cmd) {
                                case "shutdown":
                                    console.log("shutdown!!!");
                                    exec("sudo shutdown -h now", function (error, stdout, stderr) {
                                    });
                                    break;
                                case "reboot":
                                    exec("sudo reboot", function (error, stdout, stderr) {
                                    });
                                    break;
                                case "restartServer":
                                    console.log("restarting server");
                                    exec("sudo /home/pi/homeVisit/shellscripts/restart_homevisit", function (error, stdout, stderr) {
                                    });
                                    break;
                                case "getInfo":
                                    this.addInfoSubscriber(clientId);
                                    this.sendOsInfo();
                                    break;
                                case "restartwlan1":
                                    console.log("restarting wlan1");
                                    var self = this;
                                    exec("/home/pi/homeVisit/shellscripts/wlan1_conf " + msg.data.param.ssid + " " + msg.data.param.passwd, function (error, stdout, stderr) {
                                        console.log("exec1");
                                    });
                                    break;
                            }
                            break;
                        case "database":
                            console.log("db command", msg);
                            switch (msg.data) {
                                case "connect":
                                    break;
                                case "repair":
                                    exec("/home/pi/homeVisit/shellscripts/repair_db", function (error, stdout, stderr) {
                                        setTimeout(function () {
                                            self.sendDbStatus(role);
                                            setTimeout(function () {
                                                self.sendDbStatus(role);
                                            }, 10000);
                                        }, 10000);
                                    });
                                    break;
                                case "getStatus":
                                    this.sendDbStatus(role);
                                    break;

                                default:
                                    break;
                            }
                            break;

                        default:
                            console.log("RaspiTools: unknown message-type");
                            break;
                    }
                } catch (e) {
                    console.log("ERROR in raspiTools.newMessage! " + e.stack);
                }
            }
        },

        sendDbStatus: function (role) {
            MongoClient.connect(mongoUri, function (err, conn) {
                var connected;
                if (err) {
                    connected = false;
                } else {
                    connected = true;
                }
                console.log("db connection ", connected);
                wsManager.msgDevicesByRole(role, 'dbStatus', {
                    connected: connected
                });
            });
        },
        sendOsInfo: function () {
            var info = {
                hostname: os.hostname(),
                type: os.type(),
                arch: os.arch(),
                uptime: os.uptime(),
                loadavg: os.loadavg(),
                totalmem: os.totalmem(),
                freemem: os.freemem(),
                interfaces: os.networkInterfaces(),
                online: this.onlineState
            };
            wsManager.msgDeviceByIds(this.infoSubscribers, "osinfo", info);
        },

        importSessions: function() {
                exec(conf.pathToApp+"homevisit_components/mongo/importSessions.js "+conf.sessionsUrl, function (error, stdout, stderr) {
                if (error) console.log ("Error in importSessions: "+error);
                console.log("Import Sessions: "+stdout);
            });

        }

    };

    var raspiToolsObj = new RaspiTools();

    module.exports = raspiToolsObj;

})();
