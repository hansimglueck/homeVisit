(function() {
    'use strict';

    module.exports = {
        executeItem: function () {
            this.mapToDevice();
        },
        getWsContent: function() {
            return {
                type: this.type,
                text: this.text["en"],
                volume: this.volume,
                silent: this.silent
            };
        }
    };

})();