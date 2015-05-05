(function() {
    'use strict';

    var playerManager = require('../../playerManager.js');

    module.exports = {
        executeItem: function () {
            this.mapToDevice();
        },
        getWsContent: function () {
            var lang = require('../../gameConf').conf.language;
            return {
                type: this.type,
                text: this.text[lang],
                silent: this.silent,
                dealType: this.dealType,
                maxSteps: this.maxSteps,
                time: this.time
            };
        },
        finishItem: function() {
            Object.keys(playerManager.deals).forEach(function (key) {
                var deal = playerManager.deals[key];
                if (deal.status === "request") {
                    deal.status = "deny";
                }
                //playerManager.sendMessage(deal.player0Id, "deal", deal);
                //playerManager.sendMessage(deal.player1Id, "deal", deal);
                playerManager.players[deal.player0Id].busy = false;
                if (typeof deal.player1Id !== "undefined") playerManager.players[deal.player1Id].busy = false;
                playerManager.sendPlayerStatus(-1);
            });

        }
    };

})();
