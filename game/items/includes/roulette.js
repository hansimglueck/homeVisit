var playerManager = require('../../playerManager.js');
var Agreement = require('../../polls/Agreement.js');


module.exports = {
    executeItem: function () {
        this.playerIds = playerManager.getPlayerGroup('joined').map(function (player) {
            return player.playerId;
        });
        var self = this;
        var poll;
        poll = new Agreement(this);
        poll.onFinish(playerManager, function (result) {
            result.win = self.win;
            result.cost = self.cost;
            playerManager.playRoulette(result);
        });
        this.poll = poll;
        this.polls[this.poll.id] = (this.poll);
        this.mapToDevice();

    },
    getData: function () {
        return this.poll.getResult();
    },
    getWsContent: function () {
        return this.poll.getPollWsContent();
    }
};

