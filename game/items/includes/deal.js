var playerManager = require('../../playerManager.js');

module.exports = {
    executeItem: function () {
        this.mapToDevice();
    },
    getWsContent: function () {
        return {
            type: this.type,
            text: this.text,
            silent: this.silent,
            dealType: this.dealType,
            maxSteps: this.maxSteps
        };
    },
    finishItem: function() {
        Object.keys(playerManager.deals).forEach(function (key) {
            var deal = playerManager.deals[key];
            if (deal.state < 3) deal.state = 4;
            playerManager.sendMessage(deal.player0Id, "deal", deal);
            playerManager.sendMessage(deal.player1Id, "deal", deal);
            playerManager.players[deal.player0Id].busy = false;
            playerManager.players[deal.player1Id].busy = false;
            playerManager.sendPlayerStatus(-1);
        });

    }
};

