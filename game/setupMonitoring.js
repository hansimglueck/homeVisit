(function () {
    'use strict';

    var wsManager = require('./wsManager.js');
    var logger = require('log4js').getLogger('setupMonitoring');
    logger.setLevel("INFO");
    var ping = require('ping');


    function SetupMonitoring() {
        this.monitoringTasks = [];
        this.monitoringTable = [
            {
                name: 'ap',
                type: 'state',
                state: false,
                necessary: true,
                hint: "Plug the AP near the table"
            },
            {
                name: 'mc',
                type: 'count',
                state: 0,
                necessary: 1,
                hint: "Start/Restart the MC-App"
            },
            {
                name: 'player',
                type: 'count',
                state: 0,
                necessary: 8,
                hint: "Turn on 8 Phones  (keep them charging battery). connect them to WIFI and start/restart the homevisit-App."
            }
        ];
        this.monitoringState = 666;
        this.apPingArr = [false,false,false];
    }

    SetupMonitoring.prototype = {
        startSetupMonitoring: function () {
            this.monitoringTasks.push({context: this, interval: 1000, task: this.checkAP, intervalObject: null});
            this.monitoringTasks.forEach(function (task) {
                task.task.call(task.context);
                if (task.interval !== 0) {
                    task.intervalObject = setInterval(function () {
                        task.task.call(task.context);
                    }, task.interval);
                }
            });
        },
        checkAP: function () {
            var self = this;
            ping.sys.probe('10.0.0.2', function (isAlive) {
                logger.debug("AP-Ping: " + isAlive);
                self.apPingArr.push(isAlive);
                self.apPingArr.shift();
                var filteredState = self.apPingArr.reduce(function (prev, curr) {
                    return curr || prev;
                });
                self.changeMonitoringValue('ap', filteredState);
            })
        },
        checkDevices: function(list) {
            var mcCount = list.filter(function(dev){
                return (dev.role === "MC")
            }).length;
            this.changeMonitoringValue("mc", mcCount);
        },
        checkPlayers: function(players) {
            var playerCount = players.filter(function(player){
                return player.joined;
            }).length;
            this.changeMonitoringValue("player", playerCount);
        },
        changeMonitoringValue: function (name, value) {
            var monitoringItem = null;
            var arr = this.monitoringTable.filter(function (m) {
                return m.name === name
            });
            if (arr.length > 0) {
                monitoringItem = arr[0];
            }
            if (monitoringItem === null) {
                return;
            }
            var oldState = monitoringItem.state;
            monitoringItem.state = value;
            if (monitoringItem.state !== oldState) {
                this.checkSetupMonitoring();
            }
        },
        checkSetupMonitoring: function (print) {
            var monitoringState = this.monitoringTable.map(function (m) {
                return {name: m.name, fullfilled: m.state >= m.necessary}
            }).filter(function (m) {
                return !m.fullfilled;
            }).length;
            logger.debug(this.monitoringTable);
            logger.info("Monitoring found " + monitoringState + " open Necessitys");
            var message = "SETUP-STATUS\n" + this.monitoringTable.map(function (m) {
                    var ret = m.name.toUpperCase() + ": ";
                    ret += (m.state >= m.necessary) ? "OK" : "no good! \n -> Hint: " + m.hint;
                    return ret;
                }).join("\n");
            if (this.monitoringState !== monitoringState || print) {
                logger.warn(message);
                if (!require('./game.js').play) {
                    logger.info("printing setup-status");
                    wsManager.msgDevicesByRole("printer", "display", {type: "info", text: message});
                }
            }
            this.monitoringState = monitoringState;
            return monitoringState;
        }

    };

    module.exports = new SetupMonitoring();

})();
