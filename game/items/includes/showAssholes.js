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
            playerManager.gameEvents.forEach(function(event){
                if (event.playerId == player.playerId && event.event.type === "score" && event.event.reason === "rating" && event.event.value == "-1") negs[event.event.otherPlayerId] += 1;
            });
            self.data[player.playerId] = negs;
        });
        this.mapToDevice();
    },
    getWsContent: function () {
        return {
            type: this.type,
            data: this.data
        };
    }
};

