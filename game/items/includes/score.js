(function() {
    var playerManager = require('../../playerManager.js');

    'use strict';

    module.exports = {
        executeItem: function () {
            var players = playerManager.getPlayerGroup(this.playerGroup);
            var self = this;
            players.forEach(function(player){
                playerManager.score(player.playerId, self.score, self.reason);
            })
        }
    };

})();
