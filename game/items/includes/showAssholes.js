var playerManager = require('../../playerManager.js');

module.exports = {
    executeItem: function () {
        this.data = [];
        var self = this;
        playerManager.players.forEach(function (player) {
            var negs = [];
            playerManager.players.forEach(function(player){
                negs[player.playerId] = 0;
            });
            var negScoreEvents = playerManager.gameEvents.forEach(function(event){
                if (event.playerId === player.playerId && event.type === "score" && event.reason === "rating" && event.value == -1) negs[event.otherPlayerId] += 1;
            });
            self.data[player.playerId] = {
                text: "Du bist Spieler "+player.playerId
            };
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

