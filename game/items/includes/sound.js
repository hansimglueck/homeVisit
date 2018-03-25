(function() {
    'use strict';

    module.exports = {
        executeItem: function () {
            this.mapToDevice();
        },
        getWsContent: function() {
            var lang = require('../../gameConf').conf.language;
            return {
                type: this.type,
                text: (typeof this.text[lang] === "undefined" || this.text[lang] == "") ? this.text["en"] : this.text[lang],
                volume: this.volume,
                silent: this.silent
            };
        }
    };

})();
