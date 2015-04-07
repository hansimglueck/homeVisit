cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/org.apache.cordova.device/www/device.js",
        "id": "org.apache.cordova.device.device",
        "clobbers": [
            "device"
        ]
    },
    {
        "file": "plugins/com.knowledgecode.cordova.websocket/www/websocket.js",
        "id": "com.knowledgecode.cordova.websocket.websocket",
        "clobbers": [
            "WebSocket"
        ]
    },
    {
        "file": "plugins/com.borismus.webintent/www/webintent.js",
        "id": "com.borismus.webintent.WebIntent",
        "clobbers": [
            "WebIntent"
        ]
    },
    {
        "file": "plugins/com.lampa.startapp/www/startApp.js",
        "id": "com.lampa.startapp.startapp",
        "merges": [
            "navigator.startApp"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.device-motion/www/Acceleration.js",
        "id": "org.apache.cordova.device-motion.Acceleration",
        "clobbers": [
            "Acceleration"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.device-motion/www/accelerometer.js",
        "id": "org.apache.cordova.device-motion.accelerometer",
        "clobbers": [
            "navigator.accelerometer"
        ]
    },
    {
        "file": "plugins/fr.drangies.cordova.serial/www/serial.js",
        "id": "fr.drangies.cordova.serial.Serial",
        "clobbers": [
            "window.serial"
        ]
    },
    {
        "file": "plugins/com.megster.cordova.bluetoothserial/www/bluetoothSerial.js",
        "id": "com.megster.cordova.bluetoothserial.bluetoothSerial",
        "clobbers": [
            "window.bluetoothSerial"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "org.apache.cordova.device": "0.3.0",
    "org.apache.cordova.console": "0.2.13",
    "com.knowledgecode.cordova.websocket": "0.8.0",
    "com.borismus.webintent": "1.0.0",
    "com.lampa.startapp": "0.0.4",
    "org.apache.cordova.device-motion": "0.2.11",
    "fr.drangies.cordova.serial": "0.0.2",
    "com.megster.cordova.bluetoothserial": "0.4.1"
}
// BOTTOM OF METADATA
});