(function() {
    'use strict';
    var logger = require('log4js').getLogger();


    module.exports = {
        executeItem: function () {
            /* jshint evil: true */
            logger.info(this.eval);
            var lang = require('../../gameConf').conf.language;
            try {
                eval(this.text[lang]);
            } catch (e) {
                logger.error(e.stack);
            }
        }
    };

})();
