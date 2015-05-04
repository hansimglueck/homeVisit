(function() {
    'use strict';

    var gameRecording = require('../../gameRecording');

    module.exports = {
        executeItem: function () {
            gameRecording.go(this);
            this.mapToDevice();
        },
        getWsContent: function() {
            var lang = require('../../gameConf').conf.language;
            return {
                type: this.type,
                text: this.text[lang],
                silent: this.silent
            };
        }
    };

})();
