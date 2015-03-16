// (c) 2013-2015 Don Coleman
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/* global mainPage, deviceList, refreshButton, statusDiv */
/* global detailPage, resultDiv, messageInput, sendButton, redButton, blueButton, disconnectButton */
/* global cordova, bluetoothSerial  */
/* jshint browser: true , devel: true*/
'use strict';

var btConnected = false;
var btSerial = {

    initialize: function () {
        this.bindEvents();
    },
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function () {
        btSerial.refreshDeviceList();
    },
    refreshDeviceList: function () {
        bluetoothSerial.list(btSerial.onDeviceList, btSerial.onError);
    },
    onDeviceList: function (devices) {
        devices.forEach(function (device) {
            if (device.id == "00:06:66:03:17:85" || device.id == "00:06:66:03:09:8A") {
                btSerial.connectById(device.id);
            }
        });
    },
    connectById: function (deviceId) {
        console.log("trying to connect BT");
        var onConnect = function () {
            // subscribe for incoming data
            bluetoothSerial.subscribe('\n', btSerial.onData, btSerial.onError);
            btConnected = true;
        };
        bluetoothSerial.connect(deviceId, onConnect, btSerial.onError);
    },

    onData: function (data) { // data received from Arduino
        console.log(data);
    },
    sendData: function (data) { // send data to Arduino
        console.log("sendData: "+data);
        var success = function () {
            console.log("btSerial.sendData: success");
        };

        var failure = function () {
            alert("Failed writing data to Bluetooth peripheral");
        };

        bluetoothSerial.write(data, success, failure);
    },
    disconnect: function (event) {
        bluetoothSerial.disconnect(btSerial.showMainPage, btSerial.onError);
    },
    onError: function (reason) {
        alert("ERROR in btSerial: " + reason); // real apps should use notification.alert
    },
    getConnected: function() {
        return btConnected;
    }
};
