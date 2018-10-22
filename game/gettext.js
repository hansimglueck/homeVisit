(function() {
    'use strict';

    var fs = require('fs');
    var Gettext = require('node-gettext');

    var gt = new Gettext();
    var poPath = __dirname + '/../po/';

    ['en', 'de', 'cs', 'da', 'fr', 'nl', 'no', 'pl', 'pt', 'gl', 'it', 'ru', 'fr_CH','en_US','tr_CY' ,'el_CY'].forEach(function(langCode) {
        gt.addTextdomain(langCode, fs.readFileSync(poPath + langCode + '.po'));
    });

    module.exports = {
        textdomain: function() {
            return gt.textdomain.apply(gt, arguments);
        },
        gettext: function() {
            var gc = require('./gameConf');
            gt.textdomain(gc.conf.language);
            return gt.gettext.apply(gt, arguments);
        }
    };

})();
