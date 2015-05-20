(function() {
    'use strict';

    var fs = require('fs');
    var logger = require('log4js').getLogger();

    module.exports = {
        executeItem: function () {
            this.mapToDevice();
        },
        getWsContent: function() {
            var lang = require('../../gameConf').conf.language, images = [], folder;
            if (typeof this.text[lang] !== 'undefined') {
                folder = this.text[lang];
                try {
                    fs.readdirSync(__dirname + '/../../../slideshow/%s'.format(folder)).forEach(function(imageFile) {
                        images.push('/slideshow/%s/%s'.format(folder, encodeURI(imageFile)));
                    });
                }
                catch (e) {
                    logger.error(e.stack);
                }
            }

            return {
                type: 'slideshow',
                images: images
            };
        }
    };

})();
