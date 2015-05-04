(function() {
    'use strict';

    var gameConf = require('../../gameConf.js');
    var gameRecording = require('../../gameRecording');

    module.exports = {
        executeItem: function () {
            gameRecording.go(this);
            gameConf.setOption(this.configField, this.value);
        }
    };
})();
