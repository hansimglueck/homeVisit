(function() {
    'use strict';
    var logger = require('log4js').getLogger();


    module.exports = {
        executeItem: function () {
            /* jshint evil: true */
            logger.info(this.eval);
            try {
                eval(this.text["en"]);
            } catch (e) {
                logger.error(e.stack);
            }
        }
    };

})();
