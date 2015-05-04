(function() {
    'use strict';

    var playerManager = require('../../playerManager.js');

    module.exports = {
        executeItem: function () {
            this.data = [];
            var self = this;
            console.log(JSON.stringify(playerManager.gameEvents));
            playerManager.players.forEach(function (player) {
                var negs = [];
                playerManager.players.forEach(function(player){
                    negs[player.playerId] = 0;
                });
                var relevantEvents = playerManager.gameEvents.filter(function(event){
                    return event.event.type === "score" &&
                        event.event.reason === "rating" &&
                        event.event.value == "-1";
                });
                if (self.assholeOptions === "worst") {
                    var worstId = playerManager.getPlayerGroup("worst")[0].playerId;
                    relevantEvents = relevantEvents.filter(function(event){
                        return event.event.otherPlayerId === worstId;
                    })
                }
                relevantEvents.forEach(function(event){
                    if (event.playerId == player.playerId) {
                        negs[event.event.otherPlayerId] += 1;
                    }
                });
                self.data[player.playerId] = negs;
            });
            this.mapToDevice();
       },
        getWsContent: function () {
            return {
                type: this.type,
                data: this.data,
                silent: this.silent,
                assholeOptions: this.assholeOptions
            };
        }
    };

})();
