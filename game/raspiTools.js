(function() {
    'use strict';

    var exec = require('child_process').exec;
    var os = require('os');
    var isOnline = require('is-online');
    var MongoClient = require('mongodb').MongoClient;
    var mongoUri = require('../homevisitConf').mongoUri;
    var wsManager = require('./wsManager.js');

    function RaspiTools() {}

    RaspiTools.prototype = {
        newMessage: function(clientId, msg) {
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
                                    this.sendOsInfo(clientId);
                                    break;
                                case "restartwlan1":
                                    console.log("restarting wlan1");
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
                                    });
                                    break;
                                case "getStatus":
                                    this.sendDbStatus();
                                    break;

                                default:
                                    break;
                            }
                            break;

                        default:
                            console.log("RaspiTools: unknown message-type");
                            break;
                    }
                } catch(e) {
                    console.log("ERROR in raspiTools.newMessage! " + e.stack);
                }
            }
        },

        sendDbStatus: function() {
            MongoClient.connect(mongoUri, function(err, conn) {
                var connected;
                if(err){
                    connected = false;
                } else {
                    connected = true;
                }
                console.log("db connection ", connected);
                wsManager.msgDevicesByRole('master', 'dbStatus', {
                    connected: connected
                });
            });
        },
        sendOsInfo: function (clientId) {
            isOnline(function(err, online) {
                var info = {
                    hostname: os.hostname(),
                    type: os.type(),
                    arch: os.arch(),
                    uptime: os.uptime(),
                    loadavg: os.loadavg(),
                    totalmem: os.totalmem(),
                    freemem: os.freemem(),
                    interfaces: os.networkInterfaces(),
                    online: online,
                };
                wsManager.msgDeviceByIds([clientId], "osinfo", info);
            });
        }

    };

    var raspiToolsObj = new RaspiTools();

    module.exports = raspiToolsObj;

})();
