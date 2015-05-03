(function() {
    'use strict';

    module.exports = {
        executeItem: function () {
            this.mapToDevice();
        },
        getWsContent: function () {
            var lang = require('../../gameConf').conf.language;
            return {
                type: this.type,
                command: this.text[lang],
                silent: this.silent,
                param: this.parameter,
                device: this.device
            };
        }
    };

})();
