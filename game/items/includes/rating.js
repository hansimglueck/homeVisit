(function() {
    'use strict';

    var playerManager = require('../../playerManager.js');

    module.exports = {
        executeItem: function () {
            this.mapToDevice();
        },
        getWsContent: function() {
            var bestWorst;
            var bestWorstArr;
            if (this.ratingType === "oneTeam") {
                bestWorstArr = playerManager.getPlayerGroup(this.bestWorst);
                if (bestWorstArr.length > 0) {
                    bestWorst = bestWorstArr.map(function (x) {
                        return x.playerId;
                    });
                }
            }
            var lang = require('../../gameConf').conf.language;
            return {
                type: this.type,
                ratingType: this.ratingType,
                posNeg: this.posNeg,
                playerId: bestWorst,
                silent: this.silent,
                text: this.text[lang],
                time: this.time
            };
        }
    };

})();
