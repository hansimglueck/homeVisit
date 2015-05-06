(function() {
    'use strict';

    var fs = require('fs');

    module.exports = {
        executeItem: function () {
            this.mapToDevice();
        },
        getWsContent: function() {
            var images = [];
            var folder = this.text;
            if (this.text.hasOwnProperty("de")) {
                folder = this.text['de'];
            }
            try {
                fs.readdirSync(__dirname + '/../../../slideshow/'+folder).forEach(function(imageFile) {
                    images.push('/slideshow/%s'.format(imageFile));
                    console.log(imageFile);
                });
            }
            catch (e) {
                console.log(e.stack);
            }

            return {
                type: 'slideshow',
                images: images
            };
        }
    };

})();
