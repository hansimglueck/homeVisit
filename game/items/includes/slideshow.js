(function() {
    'use strict';

    var fs = require('fs');
    var logger = require('log4js').getLogger();

    /**
     * Randomize array element order in-place.
     * Using Durstenfeld shuffle algorithm.
     */
    function shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }


    module.exports = {
        executeItem: function () {
            this.mapToDevice();
        },
        getWsContent: function() {
            var lang = "en", images = [], folder;
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
                silent: this.silent,
                images: shuffleArray(images)
            };
        }
    };

})();
