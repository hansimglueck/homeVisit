(function () {
    'use strict';

    module.exports = {
        executeItem: function () {
            this.mapToDevice();
        },
        getWsContent: function () {
            var lang = require('../../gameConf').conf.language;
            return {
                type: this.type,
                data: {
                    type: "file",
                    param: this.text[lang]
                },
                silent: this.silent
            };
        }
    };

})();
