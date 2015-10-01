(function () {
    'use strict';
    var hat = require('hat');
    var playerManager = require('../../playerManager.js');

    module.exports = {
        executeItem: function () {
            this.id = hat();
            this.requiredActions = 0;
            this.mapToDevice();
        },
        rate: function (data) {
            console.log("rate mal !!");
            playerManager.score(data.player1Id, data.score, "rating", data.player0Id);
            this.requiredActions--;
            console.log("noch "+this.requiredActions);
            if (this.requiredActions === 0) {
                this.step();
            }
        },
        getWsContent: function () {
            var bestWorst = [];
            var bestWorstArr;
            if (this.ratingType === "oneTeam") {
                bestWorstArr = playerManager.getPlayerGroup(this.bestWorst);
                if (bestWorstArr.length > 0) {
                    bestWorst = bestWorstArr.map(function (x) {
                        return x.playerId;
                    });
                }
                this.requiredActions = 0-bestWorst.length;
            }
            var lang = require('../../gameConf').conf.language;
            return {
                type: this.type,
                ratingType: this.ratingType,
                posNeg: this.posNeg,
                playerId: bestWorst,
                silent: this.silent,
                text: this.text[lang],
                time: this.time,
                posText: (typeof this.posText !== "undefined") ? this.posText[lang] : "",
                negText: (typeof this.negText !== "undefined") ? this.negText[lang] : "",
                pollId: this.id
            };
        }
    };

})
();
