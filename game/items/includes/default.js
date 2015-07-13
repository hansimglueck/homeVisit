(function() {
    'use strict';

    module.exports = {
        executeItem: function () {
            console.log("default include hier!");
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
