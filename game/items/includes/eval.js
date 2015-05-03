(function() {
    'use strict';

    module.exports = {
        executeItem: function () {
            /* jshint evil: true */
            console.log(this.eval);
            var lang = require('../../gameConf').conf.language;
            try {
                eval(this.text[lang]);
            } catch (e) {
                console.log(e.stack);
            }
        }
    };

})();
