(function() {
    'use strict';

    module.exports = {
        executeItem: function () {
            this.mapToDevice();
        },
        getWsContent: function () {
            return {
                type: this.type,
                command: this.text['en'],
                silent: this.silent,
                param: this.parameter,
                device: this.device
            };
        }
    };

})();
