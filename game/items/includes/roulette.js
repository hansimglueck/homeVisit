(function() {
    'use strict';

    var playerManager = require('../../playerManager.js');
    var Agreement = require('../../polls/Agreement.js');
    var gameRecording = require('../../gameRecording');

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
                //TODO diese beiden teile werden nur für die richtigen recordings gesetzt. sollten aber wahrscheinlich schon im agreement so gesetzt werden
                result.voteType = "agreement";
                results.rid = this.uid;
                gameRecording.poll(result);
                playerManager.playRoulette(result);
            });
            this.poll = poll;
            this.polls[this.poll.id] = this.poll;
            this.mapToDevice();

        },
        getData: function () {
            if (typeof this.poll !== "undefined") {
                return this.poll.getResult();
            }
            return null;
        },
        getWsContent: function () {
            var ret = this.poll.getPollWsContent();
            ret.type = "roulette";
            return ret;
        }
    };

})();
