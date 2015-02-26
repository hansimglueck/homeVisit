var exec = require('child_process').exec;
var os = require('os');

function RaspiTools() {

}

RaspiTools.prototype = {
    newMessage: function(clientId, msg) {
        if (typeof msg != "undefined") switch (msg.type) {
            case "os":
                 switch (msg.data) {
                    case "shutdown":
                        exec("sudo shutdown -h now", function (error, stdout, stderr) {
                            console.log("exec1")
                        });
                        //exec("android", function (error, stdout, stderr) {console.log("exec1")});
                        break;
                    case "getInfo":
                        //self.sendOsInfo(ws);
                        break;
                    case "restartwlan1":
                        console.log("restarting wlan1");
                        exec("/home/pi/homeVisit/shellscripts/wlan1_conf " + msg.para.ssid + " " + msg.para.passwd, function (error, stdout, stderr) {
                            console.log("exec1");
                            //self.sendOsInfo(ws);
                        });
                        break;
                }
                break;

            default:
                console.log("RaspiTools: unknown message-type");
                break;

        }



    }
}

var raspiToolsObj = new RaspiTools();

module.exports = raspiToolsObj;