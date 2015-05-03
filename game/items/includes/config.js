(function() {
    'use strict';

    var gameConf = require('../../gameConf.js');

    module.exports = {
        executeItem: function () {
            gameConf.setOption(this.configField, this.value);
        }
    };
})();
